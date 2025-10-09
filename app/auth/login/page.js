'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
		setLoading(true);

        const res = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
            const user = await res.json();
            localStorage.setItem('user', JSON.stringify(user));
            router.push('/pages/home');
        } else {
            const { error } = await res.json();
            toast.error('Échec de la connexion.', error);
        }
		setLoading(false);
    };

    return (
        <div className='flex items-center justify-center w-full h-screen'>
            <form onSubmit={handleLogin} className="p-6 max-w-md">
                <div className="text-center mb-8">
					<div className="flex justify-center mb-4">
						<Image src="/favicon.png" alt="Teamo Logo" width={60} height={60} className="rounded-md"
							priority
							unoptimized
                        />
					</div>
					<h1 className="text-2xl font-bold text-gray-900 mb-2">Connexion</h1>
					<p className="text-gray-600">Accédez à votre espace de gestion</p>
				</div>
                <input placeholder="Nom d'utilisateur" className="border border-gray-200 rounded-md p-2 w-full mb-2"
                    value={username} onChange={e => setUsername(e.target.value)} />
                <input placeholder="Mot de passe" type="password" className="border border-gray-200 rounded-md p-2 w-full mb-2"
                    value={password} onChange={e => setPassword(e.target.value)} />
                <button className="bg-orange-600 text-white p-2 w-full rounded-xl mt-3 flex items-center justify-center gap-2">
                    {loading ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin" />
							Connexion en cours...
						</>
					) : (
						'Se connecter'
					)}
                </button>
            </form>
        </div>
    );
}
