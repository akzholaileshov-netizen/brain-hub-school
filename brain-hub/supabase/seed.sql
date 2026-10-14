-- Brain Hub curriculum seed (generated from lib/curriculum.ts)
-- Safe to re-run: truncates catalog tables first.
TRUNCATE public.ielts_mock_questions, public.assessment_questions, public.assessments, public.videos, public.subjects RESTART IDENTITY CASCADE;

DO $$
DECLARE
  v_subject bigint;
  v_assessment bigint;
BEGIN
  INSERT INTO public.subjects (track_id, name, slug, sort_order)
    VALUES ('info-mat', 'Информатика', 'informatika', 0)
    RETURNING id INTO v_subject;
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Алгоритм және блок-схема', 420, '/videos/sample.mp4', 0);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Python: айнымалылар мен типтер', 510, '/videos/sample.mp4', 1);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Циклдер мен шарттар', 600, '/videos/sample.mp4', 2);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'homework', 'Информатика: үй жұмысы', 0)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, '«алгоритм» тақырыбындағы негізгі ұғым қандай?', '["Негізгі анықтама мен ережелер","Тек даталар тізімі","Кездейсоқ фактілер","Суреттер галереясы"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тапсырманы орындаудың дұрыс тәртібі қандай?', '["Шартты оқу → мысал қарау → жауап беру","Бірден жауапты таңдау","Тек видеоны өткізіп жіберу","Ештеңе істемеу"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Қате жауаптан кейін не істеу керек?', '["Түсіндірмені қайта оқып, қайта көру","Тестті біржола тастау","Басқа пәнге өту","Нәтижені өзгерту"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Үй жұмысының мақсаты не?', '["Білімді бекіту және әлсіз тұстарды анықтау","Уақытты өткізу","Тек балл жинау","Мұғалімді тексеру"]'::jsonb, 0, 3);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'test', 'Информатика: бақылау тесті', 1)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Информатика пәні бойынша ең маңызды дағды қандай?', '["Талдау және есеп шығару","Тек жаттау","Кездейсоқ таңдау","Интернеттен көшіру"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тест кезінде уақытты қалай басқарасыз?', '["Оңай сұрақтан бастап, қиынға ораламын","Тек бір сұрақта ұзақ отырамын","Жауапсыз өткіземін","Таймерге қарамаймын"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Дұрыс жауапты қалай тексересіз?', '["Шарт пен нұсқаларды салыстырамын","Бірінші нұсқаны басамын","Досымнан сұраймын","Кездейсоқ таңдаймын"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Жоғары нәтиже үшін не қажет?', '["Жүйелі практика және қателерді талдау","Тек бір рет қарау","Ештеңе істемеу","Тек бейне көру"]'::jsonb, 0, 3);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Бақылау тестінің нәтижесі не көрсетеді?', '["Тақырыпты меңгеру деңгейі","Интернет жылдамдығы","Компьютер моделі","Тіркелу күні"]'::jsonb, 0, 4);
END $$;
DO $$
DECLARE
  v_subject bigint;
  v_assessment bigint;
BEGIN
  INSERT INTO public.subjects (track_id, name, slug, sort_order)
    VALUES ('info-mat', 'Математикалық сауаттылық', 'mat-sauattylyq', 1)
    RETURNING id INTO v_subject;
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Пайыз және пропорция', 420, '/videos/sample.mp4', 0);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Кесте мен диаграмманы оқу', 510, '/videos/sample.mp4', 1);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Күнделікті есептер', 600, '/videos/sample.mp4', 2);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'homework', 'Математикалық сауаттылық: үй жұмысы', 0)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, '«сауаттылық» тақырыбындағы негізгі ұғым қандай?', '["Негізгі анықтама мен ережелер","Тек даталар тізімі","Кездейсоқ фактілер","Суреттер галереясы"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тапсырманы орындаудың дұрыс тәртібі қандай?', '["Шартты оқу → мысал қарау → жауап беру","Бірден жауапты таңдау","Тек видеоны өткізіп жіберу","Ештеңе істемеу"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Қате жауаптан кейін не істеу керек?', '["Түсіндірмені қайта оқып, қайта көру","Тестті біржола тастау","Басқа пәнге өту","Нәтижені өзгерту"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Үй жұмысының мақсаты не?', '["Білімді бекіту және әлсіз тұстарды анықтау","Уақытты өткізу","Тек балл жинау","Мұғалімді тексеру"]'::jsonb, 0, 3);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'test', 'Математикалық сауаттылық: бақылау тесті', 1)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Математикалық сауаттылық пәні бойынша ең маңызды дағды қандай?', '["Талдау және есеп шығару","Тек жаттау","Кездейсоқ таңдау","Интернеттен көшіру"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тест кезінде уақытты қалай басқарасыз?', '["Оңай сұрақтан бастап, қиынға ораламын","Тек бір сұрақта ұзақ отырамын","Жауапсыз өткіземін","Таймерге қарамаймын"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Дұрыс жауапты қалай тексересіз?', '["Шарт пен нұсқаларды салыстырамын","Бірінші нұсқаны басамын","Досымнан сұраймын","Кездейсоқ таңдаймын"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Жоғары нәтиже үшін не қажет?', '["Жүйелі практика және қателерді талдау","Тек бір рет қарау","Ештеңе істемеу","Тек бейне көру"]'::jsonb, 0, 3);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Бақылау тестінің нәтижесі не көрсетеді?', '["Тақырыпты меңгеру деңгейі","Интернет жылдамдығы","Компьютер моделі","Тіркелу күні"]'::jsonb, 0, 4);
END $$;
DO $$
DECLARE
  v_subject bigint;
  v_assessment bigint;
BEGIN
  INSERT INTO public.subjects (track_id, name, slug, sort_order)
    VALUES ('info-mat', 'Математика', 'matematika', 2)
    RETURNING id INTO v_subject;
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Теңдеулер жүйесі', 420, '/videos/sample.mp4', 0);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Функция және график', 510, '/videos/sample.mp4', 1);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Ықтималдық негіздері', 600, '/videos/sample.mp4', 2);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'homework', 'Математика: үй жұмысы', 0)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, '«математика» тақырыбындағы негізгі ұғым қандай?', '["Негізгі анықтама мен ережелер","Тек даталар тізімі","Кездейсоқ фактілер","Суреттер галереясы"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тапсырманы орындаудың дұрыс тәртібі қандай?', '["Шартты оқу → мысал қарау → жауап беру","Бірден жауапты таңдау","Тек видеоны өткізіп жіберу","Ештеңе істемеу"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Қате жауаптан кейін не істеу керек?', '["Түсіндірмені қайта оқып, қайта көру","Тестті біржола тастау","Басқа пәнге өту","Нәтижені өзгерту"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Үй жұмысының мақсаты не?', '["Білімді бекіту және әлсіз тұстарды анықтау","Уақытты өткізу","Тек балл жинау","Мұғалімді тексеру"]'::jsonb, 0, 3);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'test', 'Математика: бақылау тесті', 1)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Математика пәні бойынша ең маңызды дағды қандай?', '["Талдау және есеп шығару","Тек жаттау","Кездейсоқ таңдау","Интернеттен көшіру"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тест кезінде уақытты қалай басқарасыз?', '["Оңай сұрақтан бастап, қиынға ораламын","Тек бір сұрақта ұзақ отырамын","Жауапсыз өткіземін","Таймерге қарамаймын"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Дұрыс жауапты қалай тексересіз?', '["Шарт пен нұсқаларды салыстырамын","Бірінші нұсқаны басамын","Досымнан сұраймын","Кездейсоқ таңдаймын"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Жоғары нәтиже үшін не қажет?', '["Жүйелі практика және қателерді талдау","Тек бір рет қарау","Ештеңе істемеу","Тек бейне көру"]'::jsonb, 0, 3);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Бақылау тестінің нәтижесі не көрсетеді?', '["Тақырыпты меңгеру деңгейі","Интернет жылдамдығы","Компьютер моделі","Тіркелу күні"]'::jsonb, 0, 4);
END $$;
DO $$
DECLARE
  v_subject bigint;
  v_assessment bigint;
BEGIN
  INSERT INTO public.subjects (track_id, name, slug, sort_order)
    VALUES ('bio-him', 'Биология', 'biologiya', 0)
    RETURNING id INTO v_subject;
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Жасуша құрылымы', 420, '/videos/sample.mp4', 0);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Генетикаға кіріспе', 510, '/videos/sample.mp4', 1);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Адам ағзасы', 600, '/videos/sample.mp4', 2);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'homework', 'Биология: үй жұмысы', 0)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, '«жасуша» тақырыбындағы негізгі ұғым қандай?', '["Негізгі анықтама мен ережелер","Тек даталар тізімі","Кездейсоқ фактілер","Суреттер галереясы"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тапсырманы орындаудың дұрыс тәртібі қандай?', '["Шартты оқу → мысал қарау → жауап беру","Бірден жауапты таңдау","Тек видеоны өткізіп жіберу","Ештеңе істемеу"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Қате жауаптан кейін не істеу керек?', '["Түсіндірмені қайта оқып, қайта көру","Тестті біржола тастау","Басқа пәнге өту","Нәтижені өзгерту"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Үй жұмысының мақсаты не?', '["Білімді бекіту және әлсіз тұстарды анықтау","Уақытты өткізу","Тек балл жинау","Мұғалімді тексеру"]'::jsonb, 0, 3);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'test', 'Биология: бақылау тесті', 1)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Биология пәні бойынша ең маңызды дағды қандай?', '["Талдау және есеп шығару","Тек жаттау","Кездейсоқ таңдау","Интернеттен көшіру"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тест кезінде уақытты қалай басқарасыз?', '["Оңай сұрақтан бастап, қиынға ораламын","Тек бір сұрақта ұзақ отырамын","Жауапсыз өткіземін","Таймерге қарамаймын"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Дұрыс жауапты қалай тексересіз?', '["Шарт пен нұсқаларды салыстырамын","Бірінші нұсқаны басамын","Досымнан сұраймын","Кездейсоқ таңдаймын"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Жоғары нәтиже үшін не қажет?', '["Жүйелі практика және қателерді талдау","Тек бір рет қарау","Ештеңе істемеу","Тек бейне көру"]'::jsonb, 0, 3);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Бақылау тестінің нәтижесі не көрсетеді?', '["Тақырыпты меңгеру деңгейі","Интернет жылдамдығы","Компьютер моделі","Тіркелу күні"]'::jsonb, 0, 4);
END $$;
DO $$
DECLARE
  v_subject bigint;
  v_assessment bigint;
BEGIN
  INSERT INTO public.subjects (track_id, name, slug, sort_order)
    VALUES ('bio-him', 'Химия', 'himiya', 1)
    RETURNING id INTO v_subject;
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Атом және периодтық жүйе', 420, '/videos/sample.mp4', 0);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Химиялық реакция түрлері', 510, '/videos/sample.mp4', 1);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Есептер практикумы', 600, '/videos/sample.mp4', 2);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'homework', 'Химия: үй жұмысы', 0)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, '«реакция» тақырыбындағы негізгі ұғым қандай?', '["Негізгі анықтама мен ережелер","Тек даталар тізімі","Кездейсоқ фактілер","Суреттер галереясы"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тапсырманы орындаудың дұрыс тәртібі қандай?', '["Шартты оқу → мысал қарау → жауап беру","Бірден жауапты таңдау","Тек видеоны өткізіп жіберу","Ештеңе істемеу"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Қате жауаптан кейін не істеу керек?', '["Түсіндірмені қайта оқып, қайта көру","Тестті біржола тастау","Басқа пәнге өту","Нәтижені өзгерту"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Үй жұмысының мақсаты не?', '["Білімді бекіту және әлсіз тұстарды анықтау","Уақытты өткізу","Тек балл жинау","Мұғалімді тексеру"]'::jsonb, 0, 3);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'test', 'Химия: бақылау тесті', 1)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Химия пәні бойынша ең маңызды дағды қандай?', '["Талдау және есеп шығару","Тек жаттау","Кездейсоқ таңдау","Интернеттен көшіру"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тест кезінде уақытты қалай басқарасыз?', '["Оңай сұрақтан бастап, қиынға ораламын","Тек бір сұрақта ұзақ отырамын","Жауапсыз өткіземін","Таймерге қарамаймын"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Дұрыс жауапты қалай тексересіз?', '["Шарт пен нұсқаларды салыстырамын","Бірінші нұсқаны басамын","Досымнан сұраймын","Кездейсоқ таңдаймын"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Жоғары нәтиже үшін не қажет?', '["Жүйелі практика және қателерді талдау","Тек бір рет қарау","Ештеңе істемеу","Тек бейне көру"]'::jsonb, 0, 3);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Бақылау тестінің нәтижесі не көрсетеді?', '["Тақырыпты меңгеру деңгейі","Интернет жылдамдығы","Компьютер моделі","Тіркелу күні"]'::jsonb, 0, 4);
END $$;
DO $$
DECLARE
  v_subject bigint;
  v_assessment bigint;
BEGIN
  INSERT INTO public.subjects (track_id, name, slug, sort_order)
    VALUES ('bio-him', 'Математикалық сауаттылық', 'mat-sauattylyq', 2)
    RETURNING id INTO v_subject;
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Графиктерді талдау', 420, '/videos/sample.mp4', 0);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Өлшем бірліктері', 510, '/videos/sample.mp4', 1);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Пайыздық есептер', 600, '/videos/sample.mp4', 2);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'homework', 'Математикалық сауаттылық: үй жұмысы', 0)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, '«сауаттылық» тақырыбындағы негізгі ұғым қандай?', '["Негізгі анықтама мен ережелер","Тек даталар тізімі","Кездейсоқ фактілер","Суреттер галереясы"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тапсырманы орындаудың дұрыс тәртібі қандай?', '["Шартты оқу → мысал қарау → жауап беру","Бірден жауапты таңдау","Тек видеоны өткізіп жіберу","Ештеңе істемеу"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Қате жауаптан кейін не істеу керек?', '["Түсіндірмені қайта оқып, қайта көру","Тестті біржола тастау","Басқа пәнге өту","Нәтижені өзгерту"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Үй жұмысының мақсаты не?', '["Білімді бекіту және әлсіз тұстарды анықтау","Уақытты өткізу","Тек балл жинау","Мұғалімді тексеру"]'::jsonb, 0, 3);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'test', 'Математикалық сауаттылық: бақылау тесті', 1)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Математикалық сауаттылық пәні бойынша ең маңызды дағды қандай?', '["Талдау және есеп шығару","Тек жаттау","Кездейсоқ таңдау","Интернеттен көшіру"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тест кезінде уақытты қалай басқарасыз?', '["Оңай сұрақтан бастап, қиынға ораламын","Тек бір сұрақта ұзақ отырамын","Жауапсыз өткіземін","Таймерге қарамаймын"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Дұрыс жауапты қалай тексересіз?', '["Шарт пен нұсқаларды салыстырамын","Бірінші нұсқаны басамын","Досымнан сұраймын","Кездейсоқ таңдаймын"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Жоғары нәтиже үшін не қажет?', '["Жүйелі практика және қателерді талдау","Тек бір рет қарау","Ештеңе істемеу","Тек бейне көру"]'::jsonb, 0, 3);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Бақылау тестінің нәтижесі не көрсетеді?', '["Тақырыпты меңгеру деңгейі","Интернет жылдамдығы","Компьютер моделі","Тіркелу күні"]'::jsonb, 0, 4);
END $$;
DO $$
DECLARE
  v_subject bigint;
  v_assessment bigint;
BEGIN
  INSERT INTO public.subjects (track_id, name, slug, sort_order)
    VALUES ('fiz-mat', 'Физика', 'fizika', 0)
    RETURNING id INTO v_subject;
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Кинематика негіздері', 420, '/videos/sample.mp4', 0);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Ньютон заңдары', 510, '/videos/sample.mp4', 1);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Электр тогы', 600, '/videos/sample.mp4', 2);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'homework', 'Физика: үй жұмысы', 0)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, '«кинематика» тақырыбындағы негізгі ұғым қандай?', '["Негізгі анықтама мен ережелер","Тек даталар тізімі","Кездейсоқ фактілер","Суреттер галереясы"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тапсырманы орындаудың дұрыс тәртібі қандай?', '["Шартты оқу → мысал қарау → жауап беру","Бірден жауапты таңдау","Тек видеоны өткізіп жіберу","Ештеңе істемеу"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Қате жауаптан кейін не істеу керек?', '["Түсіндірмені қайта оқып, қайта көру","Тестті біржола тастау","Басқа пәнге өту","Нәтижені өзгерту"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Үй жұмысының мақсаты не?', '["Білімді бекіту және әлсіз тұстарды анықтау","Уақытты өткізу","Тек балл жинау","Мұғалімді тексеру"]'::jsonb, 0, 3);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'test', 'Физика: бақылау тесті', 1)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Физика пәні бойынша ең маңызды дағды қандай?', '["Талдау және есеп шығару","Тек жаттау","Кездейсоқ таңдау","Интернеттен көшіру"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тест кезінде уақытты қалай басқарасыз?', '["Оңай сұрақтан бастап, қиынға ораламын","Тек бір сұрақта ұзақ отырамын","Жауапсыз өткіземін","Таймерге қарамаймын"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Дұрыс жауапты қалай тексересіз?', '["Шарт пен нұсқаларды салыстырамын","Бірінші нұсқаны басамын","Досымнан сұраймын","Кездейсоқ таңдаймын"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Жоғары нәтиже үшін не қажет?', '["Жүйелі практика және қателерді талдау","Тек бір рет қарау","Ештеңе істемеу","Тек бейне көру"]'::jsonb, 0, 3);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Бақылау тестінің нәтижесі не көрсетеді?', '["Тақырыпты меңгеру деңгейі","Интернет жылдамдығы","Компьютер моделі","Тіркелу күні"]'::jsonb, 0, 4);
END $$;
DO $$
DECLARE
  v_subject bigint;
  v_assessment bigint;
BEGIN
  INSERT INTO public.subjects (track_id, name, slug, sort_order)
    VALUES ('fiz-mat', 'Математика', 'matematika', 1)
    RETURNING id INTO v_subject;
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Векторлар', 420, '/videos/sample.mp4', 0);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Туындыға кіріспе', 510, '/videos/sample.mp4', 1);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Тригонометрия', 600, '/videos/sample.mp4', 2);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'homework', 'Математика: үй жұмысы', 0)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, '«вектор» тақырыбындағы негізгі ұғым қандай?', '["Негізгі анықтама мен ережелер","Тек даталар тізімі","Кездейсоқ фактілер","Суреттер галереясы"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тапсырманы орындаудың дұрыс тәртібі қандай?', '["Шартты оқу → мысал қарау → жауап беру","Бірден жауапты таңдау","Тек видеоны өткізіп жіберу","Ештеңе істемеу"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Қате жауаптан кейін не істеу керек?', '["Түсіндірмені қайта оқып, қайта көру","Тестті біржола тастау","Басқа пәнге өту","Нәтижені өзгерту"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Үй жұмысының мақсаты не?', '["Білімді бекіту және әлсіз тұстарды анықтау","Уақытты өткізу","Тек балл жинау","Мұғалімді тексеру"]'::jsonb, 0, 3);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'test', 'Математика: бақылау тесті', 1)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Математика пәні бойынша ең маңызды дағды қандай?', '["Талдау және есеп шығару","Тек жаттау","Кездейсоқ таңдау","Интернеттен көшіру"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тест кезінде уақытты қалай басқарасыз?', '["Оңай сұрақтан бастап, қиынға ораламын","Тек бір сұрақта ұзақ отырамын","Жауапсыз өткіземін","Таймерге қарамаймын"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Дұрыс жауапты қалай тексересіз?', '["Шарт пен нұсқаларды салыстырамын","Бірінші нұсқаны басамын","Досымнан сұраймын","Кездейсоқ таңдаймын"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Жоғары нәтиже үшін не қажет?', '["Жүйелі практика және қателерді талдау","Тек бір рет қарау","Ештеңе істемеу","Тек бейне көру"]'::jsonb, 0, 3);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Бақылау тестінің нәтижесі не көрсетеді?', '["Тақырыпты меңгеру деңгейі","Интернет жылдамдығы","Компьютер моделі","Тіркелу күні"]'::jsonb, 0, 4);
END $$;
DO $$
DECLARE
  v_subject bigint;
  v_assessment bigint;
BEGIN
  INSERT INTO public.subjects (track_id, name, slug, sort_order)
    VALUES ('fiz-mat', 'Математикалық сауаттылық', 'mat-sauattylyq', 2)
    RETURNING id INTO v_subject;
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Формулаларды қолдану', 420, '/videos/sample.mp4', 0);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Графиктік есептер', 510, '/videos/sample.mp4', 1);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Бірліктерді түрлендіру', 600, '/videos/sample.mp4', 2);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'homework', 'Математикалық сауаттылық: үй жұмысы', 0)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, '«сауаттылық» тақырыбындағы негізгі ұғым қандай?', '["Негізгі анықтама мен ережелер","Тек даталар тізімі","Кездейсоқ фактілер","Суреттер галереясы"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тапсырманы орындаудың дұрыс тәртібі қандай?', '["Шартты оқу → мысал қарау → жауап беру","Бірден жауапты таңдау","Тек видеоны өткізіп жіберу","Ештеңе істемеу"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Қате жауаптан кейін не істеу керек?', '["Түсіндірмені қайта оқып, қайта көру","Тестті біржола тастау","Басқа пәнге өту","Нәтижені өзгерту"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Үй жұмысының мақсаты не?', '["Білімді бекіту және әлсіз тұстарды анықтау","Уақытты өткізу","Тек балл жинау","Мұғалімді тексеру"]'::jsonb, 0, 3);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'test', 'Математикалық сауаттылық: бақылау тесті', 1)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Математикалық сауаттылық пәні бойынша ең маңызды дағды қандай?', '["Талдау және есеп шығару","Тек жаттау","Кездейсоқ таңдау","Интернеттен көшіру"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тест кезінде уақытты қалай басқарасыз?', '["Оңай сұрақтан бастап, қиынға ораламын","Тек бір сұрақта ұзақ отырамын","Жауапсыз өткіземін","Таймерге қарамаймын"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Дұрыс жауапты қалай тексересіз?', '["Шарт пен нұсқаларды салыстырамын","Бірінші нұсқаны басамын","Досымнан сұраймын","Кездейсоқ таңдаймын"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Жоғары нәтиже үшін не қажет?', '["Жүйелі практика және қателерді талдау","Тек бір рет қарау","Ештеңе істемеу","Тек бейне көру"]'::jsonb, 0, 3);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Бақылау тестінің нәтижесі не көрсетеді?', '["Тақырыпты меңгеру деңгейі","Интернет жылдамдығы","Компьютер моделі","Тіркелу күні"]'::jsonb, 0, 4);
END $$;
DO $$
DECLARE
  v_subject bigint;
  v_assessment bigint;
BEGIN
  INSERT INTO public.subjects (track_id, name, slug, sort_order)
    VALUES ('geo-mat', 'География', 'geografiya', 0)
    RETURNING id INTO v_subject;
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Физикалық география', 420, '/videos/sample.mp4', 0);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Экономикалық география', 510, '/videos/sample.mp4', 1);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Қазақстан географиясы', 600, '/videos/sample.mp4', 2);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'homework', 'География: үй жұмысы', 0)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, '«география» тақырыбындағы негізгі ұғым қандай?', '["Негізгі анықтама мен ережелер","Тек даталар тізімі","Кездейсоқ фактілер","Суреттер галереясы"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тапсырманы орындаудың дұрыс тәртібі қандай?', '["Шартты оқу → мысал қарау → жауап беру","Бірден жауапты таңдау","Тек видеоны өткізіп жіберу","Ештеңе істемеу"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Қате жауаптан кейін не істеу керек?', '["Түсіндірмені қайта оқып, қайта көру","Тестті біржола тастау","Басқа пәнге өту","Нәтижені өзгерту"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Үй жұмысының мақсаты не?', '["Білімді бекіту және әлсіз тұстарды анықтау","Уақытты өткізу","Тек балл жинау","Мұғалімді тексеру"]'::jsonb, 0, 3);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'test', 'География: бақылау тесті', 1)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'География пәні бойынша ең маңызды дағды қандай?', '["Талдау және есеп шығару","Тек жаттау","Кездейсоқ таңдау","Интернеттен көшіру"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тест кезінде уақытты қалай басқарасыз?', '["Оңай сұрақтан бастап, қиынға ораламын","Тек бір сұрақта ұзақ отырамын","Жауапсыз өткіземін","Таймерге қарамаймын"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Дұрыс жауапты қалай тексересіз?', '["Шарт пен нұсқаларды салыстырамын","Бірінші нұсқаны басамын","Досымнан сұраймын","Кездейсоқ таңдаймын"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Жоғары нәтиже үшін не қажет?', '["Жүйелі практика және қателерді талдау","Тек бір рет қарау","Ештеңе істемеу","Тек бейне көру"]'::jsonb, 0, 3);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Бақылау тестінің нәтижесі не көрсетеді?', '["Тақырыпты меңгеру деңгейі","Интернет жылдамдығы","Компьютер моделі","Тіркелу күні"]'::jsonb, 0, 4);
END $$;
DO $$
DECLARE
  v_subject bigint;
  v_assessment bigint;
BEGIN
  INSERT INTO public.subjects (track_id, name, slug, sort_order)
    VALUES ('geo-mat', 'Математика', 'matematika', 1)
    RETURNING id INTO v_subject;
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Статистика негіздері', 420, '/videos/sample.mp4', 0);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Координаталық жазықтық', 510, '/videos/sample.mp4', 1);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Пайыз және өсу', 600, '/videos/sample.mp4', 2);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'homework', 'Математика: үй жұмысы', 0)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, '«статистика» тақырыбындағы негізгі ұғым қандай?', '["Негізгі анықтама мен ережелер","Тек даталар тізімі","Кездейсоқ фактілер","Суреттер галереясы"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тапсырманы орындаудың дұрыс тәртібі қандай?', '["Шартты оқу → мысал қарау → жауап беру","Бірден жауапты таңдау","Тек видеоны өткізіп жіберу","Ештеңе істемеу"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Қате жауаптан кейін не істеу керек?', '["Түсіндірмені қайта оқып, қайта көру","Тестті біржола тастау","Басқа пәнге өту","Нәтижені өзгерту"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Үй жұмысының мақсаты не?', '["Білімді бекіту және әлсіз тұстарды анықтау","Уақытты өткізу","Тек балл жинау","Мұғалімді тексеру"]'::jsonb, 0, 3);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'test', 'Математика: бақылау тесті', 1)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Математика пәні бойынша ең маңызды дағды қандай?', '["Талдау және есеп шығару","Тек жаттау","Кездейсоқ таңдау","Интернеттен көшіру"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тест кезінде уақытты қалай басқарасыз?', '["Оңай сұрақтан бастап, қиынға ораламын","Тек бір сұрақта ұзақ отырамын","Жауапсыз өткіземін","Таймерге қарамаймын"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Дұрыс жауапты қалай тексересіз?', '["Шарт пен нұсқаларды салыстырамын","Бірінші нұсқаны басамын","Досымнан сұраймын","Кездейсоқ таңдаймын"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Жоғары нәтиже үшін не қажет?', '["Жүйелі практика және қателерді талдау","Тек бір рет қарау","Ештеңе істемеу","Тек бейне көру"]'::jsonb, 0, 3);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Бақылау тестінің нәтижесі не көрсетеді?', '["Тақырыпты меңгеру деңгейі","Интернет жылдамдығы","Компьютер моделі","Тіркелу күні"]'::jsonb, 0, 4);
END $$;
DO $$
DECLARE
  v_subject bigint;
  v_assessment bigint;
BEGIN
  INSERT INTO public.subjects (track_id, name, slug, sort_order)
    VALUES ('geo-mat', 'Математикалық сауаттылық', 'mat-sauattylyq', 2)
    RETURNING id INTO v_subject;
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Карта мен масштаб', 420, '/videos/sample.mp4', 0);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Кестелік деректер', 510, '/videos/sample.mp4', 1);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Аналитикалық есептер', 600, '/videos/sample.mp4', 2);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'homework', 'Математикалық сауаттылық: үй жұмысы', 0)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, '«сауаттылық» тақырыбындағы негізгі ұғым қандай?', '["Негізгі анықтама мен ережелер","Тек даталар тізімі","Кездейсоқ фактілер","Суреттер галереясы"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тапсырманы орындаудың дұрыс тәртібі қандай?', '["Шартты оқу → мысал қарау → жауап беру","Бірден жауапты таңдау","Тек видеоны өткізіп жіберу","Ештеңе істемеу"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Қате жауаптан кейін не істеу керек?', '["Түсіндірмені қайта оқып, қайта көру","Тестті біржола тастау","Басқа пәнге өту","Нәтижені өзгерту"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Үй жұмысының мақсаты не?', '["Білімді бекіту және әлсіз тұстарды анықтау","Уақытты өткізу","Тек балл жинау","Мұғалімді тексеру"]'::jsonb, 0, 3);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'test', 'Математикалық сауаттылық: бақылау тесті', 1)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Математикалық сауаттылық пәні бойынша ең маңызды дағды қандай?', '["Талдау және есеп шығару","Тек жаттау","Кездейсоқ таңдау","Интернеттен көшіру"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тест кезінде уақытты қалай басқарасыз?', '["Оңай сұрақтан бастап, қиынға ораламын","Тек бір сұрақта ұзақ отырамын","Жауапсыз өткіземін","Таймерге қарамаймын"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Дұрыс жауапты қалай тексересіз?', '["Шарт пен нұсқаларды салыстырамын","Бірінші нұсқаны басамын","Досымнан сұраймын","Кездейсоқ таңдаймын"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Жоғары нәтиже үшін не қажет?', '["Жүйелі практика және қателерді талдау","Тек бір рет қарау","Ештеңе істемеу","Тек бейне көру"]'::jsonb, 0, 3);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Бақылау тестінің нәтижесі не көрсетеді?', '["Тақырыпты меңгеру деңгейі","Интернет жылдамдығы","Компьютер моделі","Тіркелу күні"]'::jsonb, 0, 4);
END $$;
DO $$
DECLARE
  v_subject bigint;
  v_assessment bigint;
BEGIN
  INSERT INTO public.subjects (track_id, name, slug, sort_order)
    VALUES ('law', 'Адам. Қоғам. Құқық', 'adam-qogam-quqyq', 0)
    RETURNING id INTO v_subject;
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Құқық ұғымы және жүйесі', 420, '/videos/sample.mp4', 0);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Адам құқықтары', 510, '/videos/sample.mp4', 1);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Азаматтық жауапкершілік', 600, '/videos/sample.mp4', 2);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'homework', 'Адам. Қоғам. Құқық: үй жұмысы', 0)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, '«құқық» тақырыбындағы негізгі ұғым қандай?', '["Негізгі анықтама мен ережелер","Тек даталар тізімі","Кездейсоқ фактілер","Суреттер галереясы"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тапсырманы орындаудың дұрыс тәртібі қандай?', '["Шартты оқу → мысал қарау → жауап беру","Бірден жауапты таңдау","Тек видеоны өткізіп жіберу","Ештеңе істемеу"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Қате жауаптан кейін не істеу керек?', '["Түсіндірмені қайта оқып, қайта көру","Тестті біржола тастау","Басқа пәнге өту","Нәтижені өзгерту"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Үй жұмысының мақсаты не?', '["Білімді бекіту және әлсіз тұстарды анықтау","Уақытты өткізу","Тек балл жинау","Мұғалімді тексеру"]'::jsonb, 0, 3);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'test', 'Адам. Қоғам. Құқық: бақылау тесті', 1)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Адам. Қоғам. Құқық пәні бойынша ең маңызды дағды қандай?', '["Талдау және есеп шығару","Тек жаттау","Кездейсоқ таңдау","Интернеттен көшіру"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тест кезінде уақытты қалай басқарасыз?', '["Оңай сұрақтан бастап, қиынға ораламын","Тек бір сұрақта ұзақ отырамын","Жауапсыз өткіземін","Таймерге қарамаймын"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Дұрыс жауапты қалай тексересіз?', '["Шарт пен нұсқаларды салыстырамын","Бірінші нұсқаны басамын","Досымнан сұраймын","Кездейсоқ таңдаймын"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Жоғары нәтиже үшін не қажет?', '["Жүйелі практика және қателерді талдау","Тек бір рет қарау","Ештеңе істемеу","Тек бейне көру"]'::jsonb, 0, 3);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Бақылау тестінің нәтижесі не көрсетеді?', '["Тақырыпты меңгеру деңгейі","Интернет жылдамдығы","Компьютер моделі","Тіркелу күні"]'::jsonb, 0, 4);
END $$;
DO $$
DECLARE
  v_subject bigint;
  v_assessment bigint;
BEGIN
  INSERT INTO public.subjects (track_id, name, slug, sort_order)
    VALUES ('law', 'Дүниежүзі тарихы', 'duniezhuzi-tarihy', 1)
    RETURNING id INTO v_subject;
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Ежелгі өркениеттер', 420, '/videos/sample.mp4', 0);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Жаңа заман төңкерістері', 510, '/videos/sample.mp4', 1);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'XX ғасыр оқиғалары', 600, '/videos/sample.mp4', 2);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'homework', 'Дүниежүзі тарихы: үй жұмысы', 0)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, '«тарих» тақырыбындағы негізгі ұғым қандай?', '["Негізгі анықтама мен ережелер","Тек даталар тізімі","Кездейсоқ фактілер","Суреттер галереясы"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тапсырманы орындаудың дұрыс тәртібі қандай?', '["Шартты оқу → мысал қарау → жауап беру","Бірден жауапты таңдау","Тек видеоны өткізіп жіберу","Ештеңе істемеу"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Қате жауаптан кейін не істеу керек?', '["Түсіндірмені қайта оқып, қайта көру","Тестті біржола тастау","Басқа пәнге өту","Нәтижені өзгерту"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Үй жұмысының мақсаты не?', '["Білімді бекіту және әлсіз тұстарды анықтау","Уақытты өткізу","Тек балл жинау","Мұғалімді тексеру"]'::jsonb, 0, 3);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'test', 'Дүниежүзі тарихы: бақылау тесті', 1)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Дүниежүзі тарихы пәні бойынша ең маңызды дағды қандай?', '["Талдау және есеп шығару","Тек жаттау","Кездейсоқ таңдау","Интернеттен көшіру"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тест кезінде уақытты қалай басқарасыз?', '["Оңай сұрақтан бастап, қиынға ораламын","Тек бір сұрақта ұзақ отырамын","Жауапсыз өткіземін","Таймерге қарамаймын"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Дұрыс жауапты қалай тексересіз?', '["Шарт пен нұсқаларды салыстырамын","Бірінші нұсқаны басамын","Досымнан сұраймын","Кездейсоқ таңдаймын"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Жоғары нәтиже үшін не қажет?', '["Жүйелі практика және қателерді талдау","Тек бір рет қарау","Ештеңе істемеу","Тек бейне көру"]'::jsonb, 0, 3);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Бақылау тестінің нәтижесі не көрсетеді?', '["Тақырыпты меңгеру деңгейі","Интернет жылдамдығы","Компьютер моделі","Тіркелу күні"]'::jsonb, 0, 4);
END $$;
DO $$
DECLARE
  v_subject bigint;
  v_assessment bigint;
BEGIN
  INSERT INTO public.subjects (track_id, name, slug, sort_order)
    VALUES ('law', 'Қазақстан тарихы', 'qazaqstan-tarihy', 2)
    RETURNING id INTO v_subject;
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Қазақ хандығы', 420, '/videos/sample.mp4', 0);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'ХХ ғасырдағы Қазақстан', 510, '/videos/sample.mp4', 1);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Тәуелсіздік жылдары', 600, '/videos/sample.mp4', 2);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'homework', 'Қазақстан тарихы: үй жұмысы', 0)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, '«Қазақстан» тақырыбындағы негізгі ұғым қандай?', '["Негізгі анықтама мен ережелер","Тек даталар тізімі","Кездейсоқ фактілер","Суреттер галереясы"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тапсырманы орындаудың дұрыс тәртібі қандай?', '["Шартты оқу → мысал қарау → жауап беру","Бірден жауапты таңдау","Тек видеоны өткізіп жіберу","Ештеңе істемеу"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Қате жауаптан кейін не істеу керек?', '["Түсіндірмені қайта оқып, қайта көру","Тестті біржола тастау","Басқа пәнге өту","Нәтижені өзгерту"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Үй жұмысының мақсаты не?', '["Білімді бекіту және әлсіз тұстарды анықтау","Уақытты өткізу","Тек балл жинау","Мұғалімді тексеру"]'::jsonb, 0, 3);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'test', 'Қазақстан тарихы: бақылау тесті', 1)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Қазақстан тарихы пәні бойынша ең маңызды дағды қандай?', '["Талдау және есеп шығару","Тек жаттау","Кездейсоқ таңдау","Интернеттен көшіру"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тест кезінде уақытты қалай басқарасыз?', '["Оңай сұрақтан бастап, қиынға ораламын","Тек бір сұрақта ұзақ отырамын","Жауапсыз өткіземін","Таймерге қарамаймын"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Дұрыс жауапты қалай тексересіз?', '["Шарт пен нұсқаларды салыстырамын","Бірінші нұсқаны басамын","Досымнан сұраймын","Кездейсоқ таңдаймын"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Жоғары нәтиже үшін не қажет?', '["Жүйелі практика және қателерді талдау","Тек бір рет қарау","Ештеңе істемеу","Тек бейне көру"]'::jsonb, 0, 3);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Бақылау тестінің нәтижесі не көрсетеді?', '["Тақырыпты меңгеру деңгейі","Интернет жылдамдығы","Компьютер моделі","Тіркелу күні"]'::jsonb, 0, 4);
END $$;
DO $$
DECLARE
  v_subject bigint;
  v_assessment bigint;
BEGIN
  INSERT INTO public.subjects (track_id, name, slug, sort_order)
    VALUES ('vip-ielts', 'Сөйлеу (Speaking)', 'speaking', 0)
    RETURNING id INTO v_subject;
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Part 1: таныстыру сұрақтары', 420, '/videos/sample.mp4', 0);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Part 2: cue card стратегиясы', 510, '/videos/sample.mp4', 1);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Part 3: пікір білдіру', 600, '/videos/sample.mp4', 2);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'homework', 'Сөйлеу (Speaking): үй жұмысы', 0)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, '«сөйлеу» тақырыбындағы негізгі ұғым қандай?', '["Негізгі анықтама мен ережелер","Тек даталар тізімі","Кездейсоқ фактілер","Суреттер галереясы"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тапсырманы орындаудың дұрыс тәртібі қандай?', '["Шартты оқу → мысал қарау → жауап беру","Бірден жауапты таңдау","Тек видеоны өткізіп жіберу","Ештеңе істемеу"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Қате жауаптан кейін не істеу керек?', '["Түсіндірмені қайта оқып, қайта көру","Тестті біржола тастау","Басқа пәнге өту","Нәтижені өзгерту"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Үй жұмысының мақсаты не?', '["Білімді бекіту және әлсіз тұстарды анықтау","Уақытты өткізу","Тек балл жинау","Мұғалімді тексеру"]'::jsonb, 0, 3);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'test', 'Сөйлеу (Speaking): бақылау тесті', 1)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Сөйлеу (Speaking) пәні бойынша ең маңызды дағды қандай?', '["Талдау және есеп шығару","Тек жаттау","Кездейсоқ таңдау","Интернеттен көшіру"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тест кезінде уақытты қалай басқарасыз?', '["Оңай сұрақтан бастап, қиынға ораламын","Тек бір сұрақта ұзақ отырамын","Жауапсыз өткіземін","Таймерге қарамаймын"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Дұрыс жауапты қалай тексересіз?', '["Шарт пен нұсқаларды салыстырамын","Бірінші нұсқаны басамын","Досымнан сұраймын","Кездейсоқ таңдаймын"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Жоғары нәтиже үшін не қажет?', '["Жүйелі практика және қателерді талдау","Тек бір рет қарау","Ештеңе істемеу","Тек бейне көру"]'::jsonb, 0, 3);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Бақылау тестінің нәтижесі не көрсетеді?', '["Тақырыпты меңгеру деңгейі","Интернет жылдамдығы","Компьютер моделі","Тіркелу күні"]'::jsonb, 0, 4);
END $$;
DO $$
DECLARE
  v_subject bigint;
  v_assessment bigint;
BEGIN
  INSERT INTO public.subjects (track_id, name, slug, sort_order)
    VALUES ('vip-ielts', 'Тыңдау (Listening)', 'listening', 1)
    RETURNING id INTO v_subject;
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Section 1–2 стратегиясы', 420, '/videos/sample.mp4', 0);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Note completion жаттығуы', 510, '/videos/sample.mp4', 1);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Map labelling тәжірибесі', 600, '/videos/sample.mp4', 2);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'homework', 'Тыңдау (Listening): үй жұмысы', 0)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, '«тыңдау» тақырыбындағы негізгі ұғым қандай?', '["Негізгі анықтама мен ережелер","Тек даталар тізімі","Кездейсоқ фактілер","Суреттер галереясы"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тапсырманы орындаудың дұрыс тәртібі қандай?', '["Шартты оқу → мысал қарау → жауап беру","Бірден жауапты таңдау","Тек видеоны өткізіп жіберу","Ештеңе істемеу"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Қате жауаптан кейін не істеу керек?', '["Түсіндірмені қайта оқып, қайта көру","Тестті біржола тастау","Басқа пәнге өту","Нәтижені өзгерту"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Үй жұмысының мақсаты не?', '["Білімді бекіту және әлсіз тұстарды анықтау","Уақытты өткізу","Тек балл жинау","Мұғалімді тексеру"]'::jsonb, 0, 3);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'test', 'Тыңдау (Listening): бақылау тесті', 1)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тыңдау (Listening) пәні бойынша ең маңызды дағды қандай?', '["Талдау және есеп шығару","Тек жаттау","Кездейсоқ таңдау","Интернеттен көшіру"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тест кезінде уақытты қалай басқарасыз?', '["Оңай сұрақтан бастап, қиынға ораламын","Тек бір сұрақта ұзақ отырамын","Жауапсыз өткіземін","Таймерге қарамаймын"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Дұрыс жауапты қалай тексересіз?', '["Шарт пен нұсқаларды салыстырамын","Бірінші нұсқаны басамын","Досымнан сұраймын","Кездейсоқ таңдаймын"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Жоғары нәтиже үшін не қажет?', '["Жүйелі практика және қателерді талдау","Тек бір рет қарау","Ештеңе істемеу","Тек бейне көру"]'::jsonb, 0, 3);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Бақылау тестінің нәтижесі не көрсетеді?', '["Тақырыпты меңгеру деңгейі","Интернет жылдамдығы","Компьютер моделі","Тіркелу күні"]'::jsonb, 0, 4);
END $$;
DO $$
DECLARE
  v_subject bigint;
  v_assessment bigint;
BEGIN
  INSERT INTO public.subjects (track_id, name, slug, sort_order)
    VALUES ('vip-ielts', 'Оқу (Reading)', 'reading', 2)
    RETURNING id INTO v_subject;
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Skimming және scanning', 420, '/videos/sample.mp4', 0);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'True / False / Not Given', 510, '/videos/sample.mp4', 1);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Matching headings', 600, '/videos/sample.mp4', 2);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'homework', 'Оқу (Reading): үй жұмысы', 0)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, '«оқу» тақырыбындағы негізгі ұғым қандай?', '["Негізгі анықтама мен ережелер","Тек даталар тізімі","Кездейсоқ фактілер","Суреттер галереясы"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тапсырманы орындаудың дұрыс тәртібі қандай?', '["Шартты оқу → мысал қарау → жауап беру","Бірден жауапты таңдау","Тек видеоны өткізіп жіберу","Ештеңе істемеу"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Қате жауаптан кейін не істеу керек?', '["Түсіндірмені қайта оқып, қайта көру","Тестті біржола тастау","Басқа пәнге өту","Нәтижені өзгерту"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Үй жұмысының мақсаты не?', '["Білімді бекіту және әлсіз тұстарды анықтау","Уақытты өткізу","Тек балл жинау","Мұғалімді тексеру"]'::jsonb, 0, 3);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'test', 'Оқу (Reading): бақылау тесті', 1)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Оқу (Reading) пәні бойынша ең маңызды дағды қандай?', '["Талдау және есеп шығару","Тек жаттау","Кездейсоқ таңдау","Интернеттен көшіру"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тест кезінде уақытты қалай басқарасыз?', '["Оңай сұрақтан бастап, қиынға ораламын","Тек бір сұрақта ұзақ отырамын","Жауапсыз өткіземін","Таймерге қарамаймын"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Дұрыс жауапты қалай тексересіз?', '["Шарт пен нұсқаларды салыстырамын","Бірінші нұсқаны басамын","Досымнан сұраймын","Кездейсоқ таңдаймын"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Жоғары нәтиже үшін не қажет?', '["Жүйелі практика және қателерді талдау","Тек бір рет қарау","Ештеңе істемеу","Тек бейне көру"]'::jsonb, 0, 3);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Бақылау тестінің нәтижесі не көрсетеді?', '["Тақырыпты меңгеру деңгейі","Интернет жылдамдығы","Компьютер моделі","Тіркелу күні"]'::jsonb, 0, 4);
END $$;
DO $$
DECLARE
  v_subject bigint;
  v_assessment bigint;
BEGIN
  INSERT INTO public.subjects (track_id, name, slug, sort_order)
    VALUES ('vip-ielts', 'Жазу (Writing)', 'writing', 3)
    RETURNING id INTO v_subject;
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Task 1: графикті сипаттау', 420, '/videos/sample.mp4', 0);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Task 2: эссе құрылымы', 510, '/videos/sample.mp4', 1);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Лексика мен байланыстырғыштар', 600, '/videos/sample.mp4', 2);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'homework', 'Жазу (Writing): үй жұмысы', 0)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, '«жазу» тақырыбындағы негізгі ұғым қандай?', '["Негізгі анықтама мен ережелер","Тек даталар тізімі","Кездейсоқ фактілер","Суреттер галереясы"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тапсырманы орындаудың дұрыс тәртібі қандай?', '["Шартты оқу → мысал қарау → жауап беру","Бірден жауапты таңдау","Тек видеоны өткізіп жіберу","Ештеңе істемеу"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Қате жауаптан кейін не істеу керек?', '["Түсіндірмені қайта оқып, қайта көру","Тестті біржола тастау","Басқа пәнге өту","Нәтижені өзгерту"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Үй жұмысының мақсаты не?', '["Білімді бекіту және әлсіз тұстарды анықтау","Уақытты өткізу","Тек балл жинау","Мұғалімді тексеру"]'::jsonb, 0, 3);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'test', 'Жазу (Writing): бақылау тесті', 1)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Жазу (Writing) пәні бойынша ең маңызды дағды қандай?', '["Талдау және есеп шығару","Тек жаттау","Кездейсоқ таңдау","Интернеттен көшіру"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тест кезінде уақытты қалай басқарасыз?', '["Оңай сұрақтан бастап, қиынға ораламын","Тек бір сұрақта ұзақ отырамын","Жауапсыз өткіземін","Таймерге қарамаймын"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Дұрыс жауапты қалай тексересіз?', '["Шарт пен нұсқаларды салыстырамын","Бірінші нұсқаны басамын","Досымнан сұраймын","Кездейсоқ таңдаймын"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Жоғары нәтиже үшін не қажет?', '["Жүйелі практика және қателерді талдау","Тек бір рет қарау","Ештеңе істемеу","Тек бейне көру"]'::jsonb, 0, 3);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Бақылау тестінің нәтижесі не көрсетеді?', '["Тақырыпты меңгеру деңгейі","Интернет жылдамдығы","Компьютер моделі","Тіркелу күні"]'::jsonb, 0, 4);
END $$;
DO $$
DECLARE
  v_subject bigint;
  v_assessment bigint;
BEGIN
  INSERT INTO public.subjects (track_id, name, slug, sort_order)
    VALUES ('ielts-service', 'Сөйлеу (Speaking)', 'speaking', 0)
    RETURNING id INTO v_subject;
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Part 1: таныстыру сұрақтары', 420, '/videos/sample.mp4', 0);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Part 2: cue card стратегиясы', 510, '/videos/sample.mp4', 1);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Part 3: пікір білдіру', 600, '/videos/sample.mp4', 2);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'homework', 'Сөйлеу (Speaking): үй жұмысы', 0)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, '«сөйлеу» тақырыбындағы негізгі ұғым қандай?', '["Негізгі анықтама мен ережелер","Тек даталар тізімі","Кездейсоқ фактілер","Суреттер галереясы"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тапсырманы орындаудың дұрыс тәртібі қандай?', '["Шартты оқу → мысал қарау → жауап беру","Бірден жауапты таңдау","Тек видеоны өткізіп жіберу","Ештеңе істемеу"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Қате жауаптан кейін не істеу керек?', '["Түсіндірмені қайта оқып, қайта көру","Тестті біржола тастау","Басқа пәнге өту","Нәтижені өзгерту"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Үй жұмысының мақсаты не?', '["Білімді бекіту және әлсіз тұстарды анықтау","Уақытты өткізу","Тек балл жинау","Мұғалімді тексеру"]'::jsonb, 0, 3);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'test', 'Сөйлеу (Speaking): бақылау тесті', 1)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Сөйлеу (Speaking) пәні бойынша ең маңызды дағды қандай?', '["Талдау және есеп шығару","Тек жаттау","Кездейсоқ таңдау","Интернеттен көшіру"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тест кезінде уақытты қалай басқарасыз?', '["Оңай сұрақтан бастап, қиынға ораламын","Тек бір сұрақта ұзақ отырамын","Жауапсыз өткіземін","Таймерге қарамаймын"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Дұрыс жауапты қалай тексересіз?', '["Шарт пен нұсқаларды салыстырамын","Бірінші нұсқаны басамын","Досымнан сұраймын","Кездейсоқ таңдаймын"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Жоғары нәтиже үшін не қажет?', '["Жүйелі практика және қателерді талдау","Тек бір рет қарау","Ештеңе істемеу","Тек бейне көру"]'::jsonb, 0, 3);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Бақылау тестінің нәтижесі не көрсетеді?', '["Тақырыпты меңгеру деңгейі","Интернет жылдамдығы","Компьютер моделі","Тіркелу күні"]'::jsonb, 0, 4);
END $$;
DO $$
DECLARE
  v_subject bigint;
  v_assessment bigint;
BEGIN
  INSERT INTO public.subjects (track_id, name, slug, sort_order)
    VALUES ('ielts-service', 'Тыңдау (Listening)', 'listening', 1)
    RETURNING id INTO v_subject;
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Section 1–2 стратегиясы', 420, '/videos/sample.mp4', 0);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Note completion жаттығуы', 510, '/videos/sample.mp4', 1);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Map labelling тәжірибесі', 600, '/videos/sample.mp4', 2);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'homework', 'Тыңдау (Listening): үй жұмысы', 0)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, '«тыңдау» тақырыбындағы негізгі ұғым қандай?', '["Негізгі анықтама мен ережелер","Тек даталар тізімі","Кездейсоқ фактілер","Суреттер галереясы"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тапсырманы орындаудың дұрыс тәртібі қандай?', '["Шартты оқу → мысал қарау → жауап беру","Бірден жауапты таңдау","Тек видеоны өткізіп жіберу","Ештеңе істемеу"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Қате жауаптан кейін не істеу керек?', '["Түсіндірмені қайта оқып, қайта көру","Тестті біржола тастау","Басқа пәнге өту","Нәтижені өзгерту"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Үй жұмысының мақсаты не?', '["Білімді бекіту және әлсіз тұстарды анықтау","Уақытты өткізу","Тек балл жинау","Мұғалімді тексеру"]'::jsonb, 0, 3);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'test', 'Тыңдау (Listening): бақылау тесті', 1)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тыңдау (Listening) пәні бойынша ең маңызды дағды қандай?', '["Талдау және есеп шығару","Тек жаттау","Кездейсоқ таңдау","Интернеттен көшіру"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тест кезінде уақытты қалай басқарасыз?', '["Оңай сұрақтан бастап, қиынға ораламын","Тек бір сұрақта ұзақ отырамын","Жауапсыз өткіземін","Таймерге қарамаймын"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Дұрыс жауапты қалай тексересіз?', '["Шарт пен нұсқаларды салыстырамын","Бірінші нұсқаны басамын","Досымнан сұраймын","Кездейсоқ таңдаймын"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Жоғары нәтиже үшін не қажет?', '["Жүйелі практика және қателерді талдау","Тек бір рет қарау","Ештеңе істемеу","Тек бейне көру"]'::jsonb, 0, 3);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Бақылау тестінің нәтижесі не көрсетеді?', '["Тақырыпты меңгеру деңгейі","Интернет жылдамдығы","Компьютер моделі","Тіркелу күні"]'::jsonb, 0, 4);
END $$;
DO $$
DECLARE
  v_subject bigint;
  v_assessment bigint;
BEGIN
  INSERT INTO public.subjects (track_id, name, slug, sort_order)
    VALUES ('ielts-service', 'Оқу (Reading)', 'reading', 2)
    RETURNING id INTO v_subject;
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Skimming және scanning', 420, '/videos/sample.mp4', 0);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'True / False / Not Given', 510, '/videos/sample.mp4', 1);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Matching headings', 600, '/videos/sample.mp4', 2);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'homework', 'Оқу (Reading): үй жұмысы', 0)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, '«оқу» тақырыбындағы негізгі ұғым қандай?', '["Негізгі анықтама мен ережелер","Тек даталар тізімі","Кездейсоқ фактілер","Суреттер галереясы"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тапсырманы орындаудың дұрыс тәртібі қандай?', '["Шартты оқу → мысал қарау → жауап беру","Бірден жауапты таңдау","Тек видеоны өткізіп жіберу","Ештеңе істемеу"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Қате жауаптан кейін не істеу керек?', '["Түсіндірмені қайта оқып, қайта көру","Тестті біржола тастау","Басқа пәнге өту","Нәтижені өзгерту"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Үй жұмысының мақсаты не?', '["Білімді бекіту және әлсіз тұстарды анықтау","Уақытты өткізу","Тек балл жинау","Мұғалімді тексеру"]'::jsonb, 0, 3);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'test', 'Оқу (Reading): бақылау тесті', 1)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Оқу (Reading) пәні бойынша ең маңызды дағды қандай?', '["Талдау және есеп шығару","Тек жаттау","Кездейсоқ таңдау","Интернеттен көшіру"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тест кезінде уақытты қалай басқарасыз?', '["Оңай сұрақтан бастап, қиынға ораламын","Тек бір сұрақта ұзақ отырамын","Жауапсыз өткіземін","Таймерге қарамаймын"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Дұрыс жауапты қалай тексересіз?', '["Шарт пен нұсқаларды салыстырамын","Бірінші нұсқаны басамын","Досымнан сұраймын","Кездейсоқ таңдаймын"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Жоғары нәтиже үшін не қажет?', '["Жүйелі практика және қателерді талдау","Тек бір рет қарау","Ештеңе істемеу","Тек бейне көру"]'::jsonb, 0, 3);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Бақылау тестінің нәтижесі не көрсетеді?', '["Тақырыпты меңгеру деңгейі","Интернет жылдамдығы","Компьютер моделі","Тіркелу күні"]'::jsonb, 0, 4);
END $$;
DO $$
DECLARE
  v_subject bigint;
  v_assessment bigint;
BEGIN
  INSERT INTO public.subjects (track_id, name, slug, sort_order)
    VALUES ('ielts-service', 'Жазу (Writing)', 'writing', 3)
    RETURNING id INTO v_subject;
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Task 1: графикті сипаттау', 420, '/videos/sample.mp4', 0);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Task 2: эссе құрылымы', 510, '/videos/sample.mp4', 1);
  INSERT INTO public.videos (subject_id, title, duration_sec, video_url, sort_order)
      VALUES (v_subject, 'Лексика мен байланыстырғыштар', 600, '/videos/sample.mp4', 2);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'homework', 'Жазу (Writing): үй жұмысы', 0)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, '«жазу» тақырыбындағы негізгі ұғым қандай?', '["Негізгі анықтама мен ережелер","Тек даталар тізімі","Кездейсоқ фактілер","Суреттер галереясы"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тапсырманы орындаудың дұрыс тәртібі қандай?', '["Шартты оқу → мысал қарау → жауап беру","Бірден жауапты таңдау","Тек видеоны өткізіп жіберу","Ештеңе істемеу"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Қате жауаптан кейін не істеу керек?', '["Түсіндірмені қайта оқып, қайта көру","Тестті біржола тастау","Басқа пәнге өту","Нәтижені өзгерту"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Үй жұмысының мақсаты не?', '["Білімді бекіту және әлсіз тұстарды анықтау","Уақытты өткізу","Тек балл жинау","Мұғалімді тексеру"]'::jsonb, 0, 3);
  INSERT INTO public.assessments (subject_id, type, title, sort_order)
      VALUES (v_subject, 'test', 'Жазу (Writing): бақылау тесті', 1)
      RETURNING id INTO v_assessment;
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Жазу (Writing) пәні бойынша ең маңызды дағды қандай?', '["Талдау және есеп шығару","Тек жаттау","Кездейсоқ таңдау","Интернеттен көшіру"]'::jsonb, 0, 0);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Тест кезінде уақытты қалай басқарасыз?', '["Оңай сұрақтан бастап, қиынға ораламын","Тек бір сұрақта ұзақ отырамын","Жауапсыз өткіземін","Таймерге қарамаймын"]'::jsonb, 0, 1);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Дұрыс жауапты қалай тексересіз?', '["Шарт пен нұсқаларды салыстырамын","Бірінші нұсқаны басамын","Досымнан сұраймын","Кездейсоқ таңдаймын"]'::jsonb, 0, 2);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Жоғары нәтиже үшін не қажет?', '["Жүйелі практика және қателерді талдау","Тек бір рет қарау","Ештеңе істемеу","Тек бейне көру"]'::jsonb, 0, 3);
  INSERT INTO public.assessment_questions (assessment_id, prompt, options_json, correct_index, sort_order)
        VALUES (v_assessment, 'Бақылау тестінің нәтижесі не көрсетеді?', '["Тақырыпты меңгеру деңгейі","Интернет жылдамдығы","Компьютер моделі","Тіркелу күні"]'::jsonb, 0, 4);
END $$;
INSERT INTO public.ielts_mock_questions (prompt, options_json, correct_index, sort_order)
VALUES ('IELTS Listening бөлімінде неше section бар?', '["4","2","6","3"]'::jsonb, 0, 0);
INSERT INTO public.ielts_mock_questions (prompt, options_json, correct_index, sort_order)
VALUES ('Writing Task 2 үшін ұсынылатын сөз саны шамамен қанша?', '["250+","100","50","400 міндетті"]'::jsonb, 0, 1);
INSERT INTO public.ielts_mock_questions (prompt, options_json, correct_index, sort_order)
VALUES ('Speaking Part 2-де дайындыққа қанша уақыт беріледі?', '["1 минут","5 минут","10 секунд","3 минут"]'::jsonb, 0, 2);
INSERT INTO public.ielts_mock_questions (prompt, options_json, correct_index, sort_order)
VALUES ('Reading сұрақтарында True/False/Not Given нені білдіреді?', '["Мәтіндегі ақпаратқа сәйкестік деңгейі","Грамматика қателері","Сөйлеу жылдамдығы","Эссе құрылымы"]'::jsonb, 0, 3);
INSERT INTO public.ielts_mock_questions (prompt, options_json, correct_index, sort_order)
VALUES ('Band 7.0 деңгейіне жету үшін не маңызды?', '["Тұрақты практика және қателерді түзету","Тек сөздік жаттау","Тестті бір рет тапсыру","Тек фильм көру"]'::jsonb, 0, 4);
INSERT INTO public.ielts_mock_questions (prompt, options_json, correct_index, sort_order)
VALUES ('Mock-тесттің мақсаты қандай?', '["Нақты емтихан жағдайын жаттықтыру","Ойын ойнау","Почтаны тексеру","GPA-ны қолмен өзгерту"]'::jsonb, 0, 5);
