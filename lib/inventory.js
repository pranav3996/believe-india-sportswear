import Product from '../models/Product';
import Order from '../models/Order';
import { logAuditAction } from './auditLog';

/**
 * Adjust stock for a product variant
 * @param {string} productId - Product ID
 * @param {string} variantId - Variant ID
 * @param {number} quantity - Quantity to add (positive) or subtract (negative)
 * @param {string} reason - Reason for adjustment
 * @param {Object} req - Request object for audit logging
 */
export async function adjustStock(productId, variantId, quantity, reason = 'Manual adjustment', req = null) {
    try {
        const product = await Product.findById(productId);

        if (!product) {
            throw new Error('Product not found');
        }

        const variant = product.variants.id(variantId);

        if (!variant) {
            throw new Error('Variant not found');
        }

        const oldStock = variant.stock;
        const newStock = oldStock + quantity;

        if (newStock < 0) {
            throw new Error('Insufficient stock');
        }

        variant.stock = newStock;
        await product.save();

        // Log the stock adjustment
        await logAuditAction({
            action: 'STOCK_UPDATE',
            resourceType: 'Product',
            resourceId: productId,
            resourceName: `${product.name} - ${variant.size} ${variant.color.name}`,
            changes: {
                before: { stock: oldStock },
                after: { stock: newStock },
            },
            description: `Stock adjusted by ${quantity} (${oldStock} → ${newStock}). Reason: ${reason}`,
            req,
        });

        return { product, variant, oldStock, newStock };
    } catch (error) {
        console.error('Failed to adjust stock:', error);
        throw error;
    }
}

/**
 * Reserve stock for an order (deduct stock)
 * @param {Array} orderItems - Array of order items with productId, variantId, quantity
 */
export async function reserveStock(orderItems) {
    const reservations = [];

    try {
        for (const item of orderItems) {
            const product = await Product.findById(item.product);

            if (!product) {
                throw new Error(`Product ${item.product} not found`);
            }

            const variant = product.variants.find(v =>
                v.size === item.variant.size &&
                v.color.name === item.variant.color
            );

            if (!variant) {
                throw new Error(`Variant not found for ${product.name}`);
            }

            if (variant.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name} - ${variant.size} ${variant.color.name}`);
            }

            const oldStock = variant.stock;
            variant.stock -= item.quantity;

            reservations.push({
                productId: product._id,
                variantId: variant._id,
                oldStock,
                newStock: variant.stock,
                quantity: item.quantity,
            });

            await product.save();
        }

        return reservations;
    } catch (error) {
        // Rollback reservations if any item fails
        for (const reservation of reservations) {
            try {
                const product = await Product.findById(reservation.productId);
                const variant = product.variants.id(reservation.variantId);
                variant.stock = reservation.oldStock;
                await product.save();
            } catch (rollbackError) {
                console.error('Failed to rollback stock reservation:', rollbackError);
            }
        }
        throw error;
    }
}

/**
 * Restore stock when order is cancelled
 * @param {string} orderId - Order ID
 */
export async function restoreStock(orderId, req = null) {
    try {
        const order = await Order.findById(orderId);

        if (!order) {
            throw new Error('Order not found');
        }

        for (const item of order.items) {
            const product = await Product.findById(item.product);

            if (!product) {
                console.error(`Product ${item.product} not found, cannot restore stock`);
                continue;
            }

            const variant = product.variants.find(v =>
                v.size === item.variant.size &&
                v.color.name === item.variant.color
            );

            if (!variant) {
                console.error(`Variant not found for ${product.name}, cannot restore stock`);
                continue;
            }

            const oldStock = variant.stock;
            variant.stock += item.quantity;
            await product.save();

            // Log the stock restoration
            await logAuditAction({
                action: 'STOCK_UPDATE',
                resourceType: 'Product',
                resourceId: product._id.toString(),
                resourceName: `${product.name} - ${variant.size} ${variant.color.name}`,
                changes: {
                    before: { stock: oldStock },
                    after: { stock: variant.stock },
                },
                description: `Stock restored from cancelled order ${order.orderId} (+${item.quantity})`,
                req,
            });
        }

        return true;
    } catch (error) {
        console.error('Failed to restore stock:', error);
        throw error;
    }
}

/**
 * Get low stock products
 * @param {number} threshold - Stock threshold (default: use variant's lowStockThreshold)
 */
export async function getLowStockProducts(threshold = null) {
    try {
        const products = await Product.find({ status: 'published' })
            .populate('category', 'name');

        const lowStockItems = [];

        for (const product of products) {
            for (const variant of product.variants) {
                const variantThreshold = threshold || variant.lowStockThreshold || 5;

                if (variant.stock <= variantThreshold && variant.isActive) {
                    lowStockItems.push({
                        product: {
                            _id: product._id,
                            name: product.name,
                            category: product.category?.name,
                        },
                        variant: {
                            _id: variant._id,
                            size: variant.size,
                            color: variant.color.name,
                            stock: variant.stock,
                            threshold: variantThreshold,
                        },
                    });
                }
            }
        }

        return lowStockItems;
    } catch (error) {
        console.error('Failed to get low stock products:', error);
        throw error;
    }
}

/**
 * Get out of stock products
 */
export async function getOutOfStockProducts() {
    try {
        const products = await Product.find({ status: 'published' })
            .populate('category', 'name');

        const outOfStockItems = [];

        for (const product of products) {
            for (const variant of product.variants) {
                if (variant.stock === 0 && variant.isActive) {
                    outOfStockItems.push({
                        product: {
                            _id: product._id,
                            name: product.name,
                            category: product.category?.name,
                        },
                        variant: {
                            _id: variant._id,
                            size: variant.size,
                            color: variant.color.name,
                        },
                    });
                }
            }
        }

        return outOfStockItems;
    } catch (error) {
        console.error('Failed to get out of stock products:', error);
        throw error;
    }
}

/**
 * Bulk update stock for multiple variants
 * @param {Array} updates - Array of {productId, variantId, stock} objects
 */
export async function bulkUpdateStock(updates, req = null) {
    const results = [];

    try {
        for (const update of updates) {
            const result = await adjustStock(
                update.productId,
                update.variantId,
                update.stock - update.currentStock, // Calculate difference
                'Bulk stock update',
                req
            );
            results.push(result);
        }

        return results;
    } catch (error) {
        console.error('Failed to bulk update stock:', error);
        throw error;
    }
}
