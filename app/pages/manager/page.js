'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import bcrypt from 'bcryptjs';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { Trash } from 'lucide-react';
import ProtectedRoute from '@/context/ProtectedRoute';

export default function ManageUsersPage() {
    const { user, isAdmin } = useAuth();
    const router = useRouter();
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ username: '', password: '', role: 'user' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return router.push('/auth/login');
        if (!isAdmin) return router.push('/pages/home');
        fetchUsers();
    }, [user]);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        const { data, error } = await supabase.from('User').select('id, username, role');
        if (error) {
            toast.error('Erreur lors du chargement des utilisateurs');
        } else {
            setUsers(data);
        }
        setLoadingUsers(false);
    };

    const handleChange = (e) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setLoading(true);

        const toastId = toast.loading('Création de l’utilisateur...');

        try {
            const hashedPassword = await bcrypt.hash(form.password, 10);

            const { error } = await supabase.from('User').insert([
                {
                    username: form.username,
                    password: hashedPassword,
                    role: form.role,
                },
            ]);

            if (error) {
                toast.error('Erreur : ' + error.message, { id: toastId });
            } else {
                toast.success('Utilisateur ajouté avec succès 🎉', { id: toastId });
                setForm({ username: '', password: '', role: 'user' });
                fetchUsers();
            }
        } catch (err) {
            toast.error('Erreur inattendue', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Supprimer cet utilisateur ?');
        if (!confirmed) return;

        const toastId = toast.loading('Suppression...');

        const { error } = await supabase.from('User').delete().eq('id', id);
        if (error) {
            toast.error('Erreur : ' + error.message, { id: toastId });
        } else {
            toast.success('Utilisateur supprimé', { id: toastId });
            fetchUsers();
        }
    };

    return (
        <ProtectedRoute>
            <div className="p-6 max-w-2xl mx-auto">
                <h1 className="text-2xl mb-4">Gérer les utilisateurs</h1>

                {/* Formulaire d'ajout */}
                <form onSubmit={handleAddUser} className="mb-6 space-y-3">
                    <input
                        type="text"
                        name="username"
                        placeholder="Nom d'utilisateur"
                        className="bg-white rounded-md border border-gray-200 p-2 w-full"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Mot de passe"
                        className="bg-white rounded-md border border-gray-200 p-2 w-full"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <select
                        name="role"
                        className="bg-white rounded-md border border-gray-200 p-2 w-full"
                        value={form.role}
                        onChange={handleChange}
                    >
                        <option value="user">Utilisateur</option>
                        <option value="admin">Administrateur</option>
                    </select>
                    <button
                        type="submit"
                        className="bg-orange-600 text-white px-4 py-2 rounded cursor-pointer"
                        disabled={loading}
                    >
                        {loading ? 'Création...' : 'Ajouter utilisateur'}
                    </button>
                </form>

                {/* Liste des utilisateurs */}
                <div className='bg-white px-3 py-2 w-full mb-4'>Liste des utilisateurs</div>
                <div className="space-y-2">
                    {loadingUsers ? (
                        <p className="text-2xl font-bold text-gray-900 px-2 py-4 w-full bg-gray-200 rounded animate-pulse"></p>
                    ) : (
                        users.map((u) => (
                            <div
                                key={u.id}
                                className="flex justify-between items-center border border-gray-200 p-3 rounded-xl bg-white"
                            >
                                <div>
                                    <p className="font-semibold">{u.username}</p>
                                    <p className="text-sm text-gray-600">Rôle : {u.role}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(u.id)}
                                    className="text-red-500 cursor-pointer"
                                >
                                    <Trash size={24} color='red' />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}