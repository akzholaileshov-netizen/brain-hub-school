-- Brain Hub: per-lesson video URLs (idempotent)
-- Paste into Supabase SQL Editor if you cannot run migrations via CLI.
-- Safe to re-run. App also falls back to lib/lesson-videos.ts if DB still has /videos/sample.mp4.

ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE public.videos ALTER COLUMN video_url DROP NOT NULL;

-- Clear shared placeholder so unresolved lessons show the Kazakh empty state
UPDATE public.videos SET video_url = NULL WHERE video_url IN ('/videos/sample.mp4') OR video_url LIKE '%/sample.mp4';

UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/soOdsFeOQr4' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'informatika' AND v.title = 'Алгоритм және блок-схема';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/kqtD5dpn9C8' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'informatika' AND v.title = 'Python: айнымалылар мен типтер';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/94UHCEmprCY' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'informatika' AND v.title = 'Циклдер мен шарттар';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/IATRm-lbBG8' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'mat-sauattylyq' AND v.title = 'Пайыз және пропорция';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/Qu1jbxHEPX0' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'mat-sauattylyq' AND v.title = 'Кесте мен диаграмманы оқу';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/Y2rKcR8NKDE' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'mat-sauattylyq' AND v.title = 'Күнделікті есептер';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/ywHYli3y3QQ' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'matematika' AND v.title = 'Теңдеулер жүйесі';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/Gdq0T4YbJPk' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'matematika' AND v.title = 'Функция және график';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/uzkc-qNVoOk' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'matematika' AND v.title = 'Ықтималдық негіздері';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/K38dtYulv2I' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'biologiya' AND v.title = 'Жасуша құрылымы';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/WK9w5Y1P_IM' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'biologiya' AND v.title = 'Генетикаға кіріспе';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/uBGl2BujkPQ' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'biologiya' AND v.title = 'Адам ағзасы';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/aPTgXKxTug4' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'himiya' AND v.title = 'Атом және периодтық жүйе';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/4Gyx2AFmQvQ' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'himiya' AND v.title = 'Химиялық реакция түрлері';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/l7NOQ1DH0BI' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'himiya' AND v.title = 'Есептер практикумы';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/6cdwhXy1a7Y' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'mat-sauattylyq' AND v.title = 'Графиктерді талдау';
UPDATE public.videos v SET video_url = NULL FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'mat-sauattylyq' AND v.title = 'Өлшем бірліктері';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/qJMrghdG27Y' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'mat-sauattylyq' AND v.title = 'Пайыздық есептер';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/4n8YoK-XL_Y' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'fizika' AND v.title = 'Кинематика негіздері';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/1jSAgHFawxM' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'fizika' AND v.title = 'Ньютон заңдары';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/uHTY1ZPj4WM' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'fizika' AND v.title = 'Электр тогы';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/fNk_zzaMoSs' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'matematika' AND v.title = 'Векторлар';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/6cdwhXy1a7Y' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'matematika' AND v.title = 'Туындыға кіріспе';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/jXv5QOz3eoY' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'matematika' AND v.title = 'Тригонометрия';
UPDATE public.videos v SET video_url = NULL FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'mat-sauattylyq' AND v.title = 'Формулаларды қолдану';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/NavEQL1rB7k' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'mat-sauattylyq' AND v.title = 'Графиктік есептер';
UPDATE public.videos v SET video_url = NULL FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'mat-sauattylyq' AND v.title = 'Бірліктерді түрлендіру';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/pYmC72lCpQg' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'geografiya' AND v.title = 'Физикалық география';
UPDATE public.videos v SET video_url = NULL FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'geografiya' AND v.title = 'Экономикалық география';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/vRIK-ikdt7c' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'geografiya' AND v.title = 'Қазақстан географиясы';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/uzkc-qNVoOk' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'matematika' AND v.title = 'Статистика негіздері';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/chxBlWp5Sb4' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'matematika' AND v.title = 'Координаталық жазықтық';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/IATRm-lbBG8' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'matematika' AND v.title = 'Пайыз және өсу';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/CzoY5kxdOk0' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'mat-sauattylyq' AND v.title = 'Карта мен масштаб';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/69eho-sFkZ8' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'mat-sauattylyq' AND v.title = 'Кестелік деректер';
UPDATE public.videos v SET video_url = NULL FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'mat-sauattylyq' AND v.title = 'Аналитикалық есептер';
UPDATE public.videos v SET video_url = NULL FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'adam-qogam-quqyq' AND v.title = 'Құқық ұғымы және жүйесі';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/eN5U04VvrTY' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'adam-qogam-quqyq' AND v.title = 'Адам құқықтары';
UPDATE public.videos v SET video_url = NULL FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'adam-qogam-quqyq' AND v.title = 'Азаматтық жауапкершілік';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/LETvyK8rKso' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'duniezhuzi-tarihy' AND v.title = 'Ежелгі өркениеттер';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/vtyFYCohbbc' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'duniezhuzi-tarihy' AND v.title = 'Жаңа заман төңкерістері';
UPDATE public.videos v SET video_url = NULL FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'duniezhuzi-tarihy' AND v.title = 'XX ғасыр оқиғалары';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/XG2dFzMRiBY' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'qazaqstan-tarihy' AND v.title = 'Қазақ хандығы';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/VLe_36tDWUM' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'qazaqstan-tarihy' AND v.title = 'ХХ ғасырдағы Қазақстан';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/ZKlEX3o3cfA' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'qazaqstan-tarihy' AND v.title = 'Тәуелсіздік жылдары';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/sRFEKvsw-vs' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'speaking' AND v.title = 'Part 1: таныстыру сұрақтары';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/4eJqU7U1R5w' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'speaking' AND v.title = 'Part 2: cue card стратегиясы';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/HtR63JFVE5Y' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'speaking' AND v.title = 'Part 3: пікір білдіру';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/q8qmJeBxk4Q' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'listening' AND v.title = 'Section 1–2 стратегиясы';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/_6jgygopp40' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'listening' AND v.title = 'Note completion жаттығуы';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/AkW0IeF46cA' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'listening' AND v.title = 'Map labelling тәжірибесі';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/RtcXr0_201A' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'reading' AND v.title = 'Skimming және scanning';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/PM3nWVXgsHo' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'reading' AND v.title = 'True / False / Not Given';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/SXdMpskBDmA' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'reading' AND v.title = 'Matching headings';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/E3U1Y1jgGls' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'writing' AND v.title = 'Task 1: графикті сипаттау';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/YngqHl_BLOU' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'writing' AND v.title = 'Task 2: эссе құрылымы';
UPDATE public.videos v SET video_url = 'https://www.youtube-nocookie.com/embed/OUlh3UidArM' FROM public.subjects s WHERE v.subject_id = s.id AND s.slug = 'writing' AND v.title = 'Лексика мен байланыстырғыштар';
