INSERT INTO public.questions (
  question_text,
  option_1,
  option_2,
  option_3,
  option_4,
  correct_index,
  order_index
)
SELECT *
FROM (
  VALUES
    ('Какая планета самая большая в Солнечной системе?', 'Марс', 'Юпитер', 'Земля', 'Венера', 1, 1),
    ('Сколько будет 7 × 8?', '54', '56', '64', '48', 1, 2),
    ('Какой язык используют браузеры для интерактивности?', 'Python', 'JavaScript', 'SQL', 'C++', 1, 3),
    ('Столица Казахстана?', 'Алматы', 'Шымкент', 'Астана', 'Караганда', 2, 4),
    ('Что означает HTML?', 'HyperText Markup Language', 'High Tech Modern Logic', 'Home Tool Markup Link', 'Hyper Transfer Machine Language', 0, 5)
) AS seed(question_text, option_1, option_2, option_3, option_4, correct_index, order_index)
WHERE NOT EXISTS (
  SELECT 1 FROM public.questions
);
