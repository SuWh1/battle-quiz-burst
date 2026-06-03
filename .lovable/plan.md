## Что делает команда `npx getdesign@latest add claude`

Эта команда из пакета `getdesign` создаёт в корне проекта файл `DESIGN.md` с дизайн-системой "Claude" (стиль Anthropic): кремовый канвас, коралловый акцент, тёмный navy для product chrome, серифные заголовки + гуманистический sans для текста. Сам пакет ничего не настраивает в коде — он только кладёт справочный markdown. Применять токены к проекту нужно вручную.

## План

### 1. Установка дизайн-системы
Запустить `npx getdesign@latest add claude` — появится `DESIGN.md` в корне как референс.

### 2. Переписать `src/styles.css` под палитру Claude
Заменить цветовые токены (в `oklch`):
- `--background`: cream `#faf9f5`
- `--foreground` / `ink`: `#141413`
- `--card`: `#efe9de`, `--card-foreground`: `#141413`
- `--primary`: coral `#cc785c`, `--primary-foreground`: cream
- `--secondary`: `#f5f0e8`
- `--muted`: `#f5f0e8`, `--muted-foreground`: `#6c6a64`
- `--accent`: teal `#5db8a6` (для подсветок состояний)
- `--destructive`: оставить красным
- `--border` / hairline: `#e6dfd8`
- `--ring`: coral с alpha 20% (для фокус-кольца)
- Dark-режим: surface `#181715`, elevated `#252320`, on-dark `#faf9f5`, on-dark-soft `#a09d96`
- `--radius`: `0.5rem` (md=8) + утилиты xs/sm/lg/xl уже выводятся из него
- Подключить шрифты Google: **EB Garamond** (display, серифные заголовки) и **Inter** (body), **JetBrains Mono** (code). Прописать `--font-display`, `--font-sans`, `--font-mono` в `@theme inline`.
- Заменить текущий фиолетово-синий градиент на `body` на кремовый канвас `#faf9f5` (это снимет «шоу-вайб», но это и есть смысл редизайна Claude).

### 3. Перерисовать `src/routes/index.tsx` под токены
Только визуал, **вся игровая логика, состояния, обработчики и тексты остаются как есть**:
- Убрать жёстко прописанные цвета (`bg-fuchsia-500/30`, `from-yellow-200`, `bg-white/10`, `text-white` и т.п.).
- Контейнер `<main>` — кремовый `bg-background`, текст `text-foreground`.
- Заголовок `QUIZ BATTLE` — серифным дисплейным шрифтом (`font-display`), цвет `text-foreground`, без градиента (по Claude — плоский ink), размер по шкале display-xl/lg.
- Кнопка «ИГРАТЬ» / «ИГРАТЬ ЕЩЁ» — `button-primary` стиль: коралл `bg-primary text-primary-foreground`, скругление `rounded-md` (8px), тень мягкая, без неона и ring. Активное состояние — `bg-primary-active` через hover/active.
- Прогресс-полоса — фон `bg-secondary`, заливка `bg-primary` (вместо жёлто-оранжевого градиента).
- Карточка вопроса — `bg-card text-card-foreground` с тонкой `border border-border` (hairline).
- Варианты ответов: дефолт — secondary (cream + hairline outline + ink-текст); правильный — `bg-[accent-teal]` (через CSS-переменную); неправильный — `bg-destructive`.
- Финальный счёт — coral акцент.
- Применить шкалу отступов Claude (md=16, lg=24, xl=32, xxl=48) через стандартные Tailwind-классы `p-4/6/8/12`.

### 4. Проверить кнопки shadcn (`src/components/ui/button.tsx`)
Файл уже использует семантические токены (`bg-primary` и т.д.) — менять не надо, он автоматически подхватит новую палитру. Просто убедиться.

### 5. Что НЕ трогаю
- Логику игры, server function `getQuestions`, таблицу `questions`, состояние, тайминги, тексты вопросов.
- `src/integrations/supabase/*`, роутер, конфиги.

### Итог
Игра останется функционально такой же (5 вопросов из БД, +1 за правильный, авто-переход), но визуально перейдёт из «яркого игрового шоу» в спокойную редакционную эстетику Claude: кремовый фон, серифные заголовки, коралловые CTA, hairline-границы.

> Хочешь сохранить «шоу-вайб» (градиент, неоновые кнопки) — скажи, и я предложу гибрид: токены Claude как база, но оставим яркий градиент-фон и неоновую главную кнопку.
