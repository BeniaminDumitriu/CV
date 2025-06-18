# 🚀 Configurarea Supabase - Ghid Complet

## 📋 Ce este Supabase?

Supabase este un serviciu cloud **GRATUIT** (ca Firebase) care oferă:
- Bază de date PostgreSQL
- Autentificare
- Stocare
- API real-time

**NU trebuie să descarci nicio aplicație!** Totul se face în browser.

## 🎯 Pași de Configurare (5 minute)

### 1. Creează cont Supabase
1. Mergi la [supabase.com](https://supabase.com)
2. Click pe "Start your project"
3. Sign up cu GitHub/Google (recomandat)

### 2. Creează proiect nou
1. Click pe "New Project"
2. Alege o organizație (sau creează una)
3. Completează:
   - **Name**: `cv-3d-bomba` (sau cum vrei tu)
   - **Database Password**: Generează uno puternic (salvează-l!)
   - **Region**: Europe (West) - London
4. Click "Create new project"
5. **Așteaptă 2-3 minute** ca proiectul să se creeze

### 3. Obține chei de configurare
După ce proiectul e gata:

1. În dashboard-ul Supabase, mergi la **Settings** → **API**
2. Vei vedea:
   - **Project URL**: `https://abc123xyz.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 4. Configurează fișierul .env
În folderul `cv-3d-bomba`, deschide fișierul `.env` și înlocuiește:

```env
REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

**Exemplu real:**
```env
REACT_APP_SUPABASE_URL=https://abc123xyz.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiYzEyM3h5eiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQ2NjI4MjAwLCJleHAiOjE5NjIyMDQyMDB9.abc123xyz
```

### 5. Configurează baza de date
1. În Supabase dashboard, mergi la **SQL Editor**
2. Click pe "New Query"
3. Copiază și paste conținutul din `database-setup.sql`
4. Click pe "Run" (▶️)

### 6. Creează primul admin
În SQL Editor, rulează:

```sql
-- Înlocuiește cu email-ul tău real
INSERT INTO user_profiles (id, email, role)
VALUES (
  gen_random_uuid(),
  'tau.email@gmail.com',  -- SCHIMBĂ AICI
  'admin'
);
```

## 🧪 Testare

### 1. Pornește aplicația
```bash
npm start
```

### 2. Testează funcționalitățile
- Mergi la `/contact` - completează formularul
- Mergi la `/admin` - loghează-te cu email-ul configurat
- Vezi dashboard-ul cu contactele primite

## 🔧 Troubleshooting

### "supabaseUrl is required"
- ✅ Verifică că ai `.env` în folderul principal
- ✅ Verifică că variabilele încep cu `REACT_APP_`
- ✅ Restart aplicația după modificarea `.env`

### "Invalid API key"
- ✅ Verifică că ai copiat corect anon key din Settings → API
- ✅ Nu folosi service_role key (e secret!)

### Nu merge autentificarea
- ✅ Rulează din nou `database-setup.sql`
- ✅ Verifică că ai adăugat user-ul în `user_profiles`

## 📝 Resurse Utile

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Documentația Supabase](https://supabase.com/docs)
- [SQL Editor în Supabase](https://supabase.com/dashboard/project/_/sql)

## 🎉 Gata!

Odată configurat, vei avea:
- ✅ Contact form funcțional
- ✅ Admin dashboard securizat  
- ✅ Bază de date în cloud
- ✅ Autentificare JWT
- ✅ **Totul GRATUIT pe Supabase!**

---

💡 **Pro tip**: Adaugă `.env` în `.gitignore` ca să nu publici cheile pe GitHub! 