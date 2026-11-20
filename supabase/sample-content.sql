-- ===========================================================================
-- Green Solutions — sample content for the live site.
-- Run once in the Supabase SQL editor, after admin.sql. Safe to run again:
-- it only removes the "Testing" post and adds the two articles if missing.
--
-- 1. Permanently deletes the placeholder article titled "Testing".
-- 2. Publishes two real articles with cover photos. The photos are served
--    by the site itself (public/articles/), so they show once this branch
--    is deployed. Replace them any time under Admin → Articles.
--
-- The articles are credited to the first admin account (or, if there is no
-- admin yet, to the author of the old Testing post).
-- ===========================================================================

begin;

-- 1. The placeholder.
delete from public.posts
where slug = 'testing' and title = 'Testing';

-- 2. Two articles.
with author as (
  select coalesce(
    (select id from public.profiles where role = 'admin' order by created_at limit 1),
    'f47101cd-fc3d-4ac7-bee8-ecf7dd7001a7'::uuid
  ) as id
)
insert into public.posts (author_id, title, slug, excerpt, body, cover_url, category, status, published_at)
select author.id, v.title, v.slug, v.excerpt, v.body, v.cover_url, v.category, 'published', v.published_at::timestamptz
from author,
(values
  (
    'It''s tomato season: grow cherry tomatoes this winter',
    'cherry-tomatoes-this-winter',
    'October to April is the window. Here is how to get sweet, crack-free cherry tomatoes from a Bahamian yard.',
    $md$The cool, dry months are the best time of year to grow tomatoes in The Bahamas, and **cherry tomatoes** are the easiest place to start. They shrug off heat and disease better than big slicing tomatoes, and a single healthy plant can keep a family in salads until spring.

## When to plant

Set out plants from **October through April**. The first ripe fruit comes **60 to 75 days** after transplanting, so a plant that goes in this month is picking by the new year.

## Where to put them

- **Full sun**, at least six hours a day.
- **Two feet apart**, so air moves between plants and leaves dry quickly after rain.
- In a raised bed or a large container if your yard is mostly sand or rock. Mix in plenty of compost; tomatoes are hungry.

## Five habits that make the difference

1. **Give them something to climb.** A cage or trellis keeps fruit off the ground, makes picking easy and lets the plant breathe.
2. **Water evenly.** Deep watering every couple of days beats a splash every evening. Uneven watering is what splits fruit and causes black, sunken bottoms (blossom-end rot).
3. **Mulch.** A layer of dry grass or leaves keeps the soil damp and cool and stops soil splashing onto the leaves.
4. **Pinch side shoots.** The small shoots that grow between the main stem and a branch take energy from fruit. Pinch them off while they are small.
5. **Pick often.** Harvest when the fruit is fully coloured but still firm. The more you pick, the more the plant sets.

> Start with two or three plants. That is enough to learn on, and more than enough tomatoes.

## Watch for

Yellowing lower leaves are normal as the plant grows; remove them. Leaves with spreading brown spots should come off too, and go in the trash rather than the compost.

Not sure what else goes in this month? See [the planting calendar](/#calendar).

*Photo: Leon Brooks, public domain, via Wikimedia Commons.*$md$,
    'https://www.gsbahamas.com/articles/cherry-tomatoes.jpg',
    'Growing guides',
    '2026-11-17 14:00:00+00'
  ),
  (
    'Okra: the crop that loves the heat the rest of your garden hates',
    'okra-loves-the-heat',
    'When summer knocks everything else flat, okra keeps producing. Plan your spring bed now and you will be picking by June.',
    $md$Every Bahamian gardener knows the summer slump: by July the lettuce has bolted, the tomatoes have quit and the beds look tired. **Okra** is the answer. It is happiest exactly when everything else is struggling, and it will keep producing pods for months.

## When to plant

Sow okra from **March through October**. Pods are ready **50 to 60 days** after sowing. Plan the bed now during the cool season, and sow as soon as the nights warm up in spring.

## Getting started

- **Soak the seeds overnight** before sowing. The hard seed coat softens and they come up days sooner.
- Sow directly where the plants will grow, **12 to 18 inches apart**, in **full sun**.
- Okra copes with poor, sandy soil better than most crops, but a handful of compost in each planting hole still pays off.

## Picking: the one rule

Pick pods **young, at 3 to 4 inches**, and pick **every day or two**. Pods left on the plant turn woody within days, and the plant slows down once it is carrying mature seed. Regular picking keeps it producing all season.

> Wear gloves and long sleeves when you pick. The leaves and pods have fine hairs that can irritate skin.

## In the kitchen

Young okra is tender enough to eat raw, and it is the backbone of okra soup, steamed okra and countless stews. A few plants are plenty for a household, so share the extra with neighbours.

Thinking about what else to plant? See [what goes in the ground this month](/#calendar).

*Photo: ArionStar, CC0, via Wikimedia Commons.*$md$,
    'https://www.gsbahamas.com/articles/okra.jpg',
    'Growing guides',
    '2026-11-06 14:00:00+00'
  )
) as v (title, slug, excerpt, body, cover_url, category, published_at)
on conflict (slug) do nothing;

commit;
