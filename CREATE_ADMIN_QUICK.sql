-- ============================================= 
-- Creare Rapidă Admin - Run în Supabase SQL Editor
-- =============================================

-- 1. Șterge eventualele date de test existente
DELETE FROM public.user_profiles WHERE id NOT IN (SELECT id FROM auth.users);

-- 2. Verifică utilizatorii existenți
SELECT email, created_at, email_confirmed_at 
FROM auth.users 
ORDER BY created_at DESC;

-- 3. Actualizează primul utilizator ca admin (SCHIMBĂ EMAIL-UL!)
-- Înlocuiește 'tau.email@gmail.com' cu email-ul tău real
UPDATE public.user_profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'beniamindumitriu@gmail.com'  -- EMAIL-UL EXISTENT!
  LIMIT 1
);

-- 4. Verifică că s-a actualizat corect
SELECT 
  u.email,
  p.role,
  u.created_at
FROM auth.users u
LEFT JOIN public.user_profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- 5. Dacă nu există utilizatorul în user_profiles, adaugă-l manual
-- (Rulează doar dacă query-ul de mai sus nu arată nimic)
INSERT INTO public.user_profiles (id, role)
SELECT id, 'admin'
FROM auth.users 
WHERE email = 'beniamindumitriu@gmail.com'  -- EMAIL-UL EXISTENT!
AND id NOT IN (SELECT id FROM public.user_profiles)
LIMIT 1;

-- =============================================
-- INSTRUCȚIUNI:
-- 1. Email-ul 'beniamindumitriu@gmail.com' e deja setat
-- 2. Rulează fiecare query step-by-step în Supabase SQL Editor
-- 3. Verifică rezultatele după fiecare pas
-- ============================================= 