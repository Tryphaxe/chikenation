import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';

export async function createCards(cardsArray) {
  const toastId = toast.loading('Création des cartes...');

  try {
    const { data, error } = await supabase
      .from('cards')
      .insert(cardsArray)
      .select(); // on récupère full_code automatiquement

    if (error) throw error;

    toast.success(`${data.length} carte(s) créée(s) avec succès`, { id: toastId });

    return data; // contient full_code pour chaque carte
  } catch (err) {
    toast.error('Erreur lors de la création des cartes : ' + err.message, { id: toastId });
    return [];
  }
}
