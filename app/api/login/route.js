import { supabase } from '@/lib/supabaseClient';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { username, password } = await req.json();

  const { data: users, error } = await supabase
    .from('User')
    .select('*')
    .eq('username', username)
    .limit(1);

  if (error || users.length === 0) {
    return NextResponse.json({ error: 'Utilisateur non trouvé.' }, { status: 404 });
  }

  const user = users[0];
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return NextResponse.json({ error: 'Mot de passe incorrect.' }, { status: 401 });
  }

  // Retourne les infos utiles
  return NextResponse.json({
    id: user.id,
    username: user.username,
    role: user.role,
  });
}