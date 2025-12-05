'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Swal from 'sweetalert2';

export default function LogoutButton({ className }) {
    const router = useRouter();

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out of your account",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#667eea',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Yes, logout',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            await signOut({ redirect: false });

            Swal.fire({
                title: 'Logged Out!',
                text: 'You have been successfully logged out',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });

            setTimeout(() => {
                router.push('/login');
            }, 1500);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className={className || "bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"}
        >
            Logout
        </button>
    );
}
