-- Fill the eight lessons that previously had no verified YouTube source.
-- Safe to re-run. Prefer lib/lesson-videos.ts as the app source of truth when DB still has /videos/sample.mp4.

UPDATE public.videos v
SET video_url = 'https://www.youtube-nocookie.com/embed/vCJTKtuBff4'
FROM public.subjects s
WHERE v.subject_id = s.id AND s.slug = 'mat-sauattylyq' AND v.title = 'Өлшем бірліктері';

UPDATE public.videos v
SET video_url = 'https://www.youtube-nocookie.com/embed/DvEvBD-LJso'
FROM public.subjects s
WHERE v.subject_id = s.id AND s.slug = 'mat-sauattylyq' AND v.title = 'Формулаларды қолдану';

UPDATE public.videos v
SET video_url = 'https://www.youtube-nocookie.com/embed/C_EOsKABAGQ'
FROM public.subjects s
WHERE v.subject_id = s.id AND s.slug = 'mat-sauattylyq' AND v.title = 'Бірліктерді түрлендіру';

UPDATE public.videos v
SET video_url = 'https://www.youtube-nocookie.com/embed/_8jSBPGJkDk'
FROM public.subjects s
WHERE v.subject_id = s.id AND s.slug = 'mat-sauattylyq' AND v.title = 'Аналитикалық есептер';

UPDATE public.videos v
SET video_url = 'https://www.youtube-nocookie.com/embed/XkAkt5gtFbg'
FROM public.subjects s
WHERE v.subject_id = s.id AND s.slug = 'geografiya' AND v.title = 'Экономикалық география';

UPDATE public.videos v
SET video_url = 'https://www.youtube-nocookie.com/embed/akSUtS12B_0'
FROM public.subjects s
WHERE v.subject_id = s.id AND s.slug = 'adam-qogam-quqyq' AND v.title = 'Құқық ұғымы және жүйесі';

UPDATE public.videos v
SET video_url = 'https://www.youtube-nocookie.com/embed/KoWiXZ34pfM'
FROM public.subjects s
WHERE v.subject_id = s.id AND s.slug = 'adam-qogam-quqyq' AND v.title = 'Азаматтық жауапкершілік';

UPDATE public.videos v
SET video_url = 'https://www.youtube-nocookie.com/embed/_OJZsJ6i6Q0'
FROM public.subjects s
WHERE v.subject_id = s.id AND s.slug = 'duniezhuzi-tarihy' AND v.title = 'XX ғасыр оқиғалары';
