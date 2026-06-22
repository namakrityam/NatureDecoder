/* ==============================================
   Nature Decoder - Homemade Alternatives
   OpenAI/Gemini-Powered Engine
   ============================================== */

const foodDatabase = [
  {
    keywords: ['maggi', 'noodles', 'instant noodles', 'chowmein', 'top ramen', 'cup noodles', 'yippee'],
    name: 'Maggi Noodles', icon: '🍜',
    alternative: {
      name: 'Homemade Noodle Alternatives', icon: '🍝',
      description: 'Instant noodles are loaded with refined flour, MSG, and preservatives. Simple Indian staples like vermicelli upma or poha give you the same quick, satisfying meal with real ingredients and zero artificial additives.',
      benefits: ['Whole grain base — complex carbs for sustained energy', 'No MSG or TBHQ preservatives', 'Rich in fiber from vegetables', 'Full control over sodium levels', 'Ready in 10–15 minutes, just like Maggi'],
      packagedIssues: ['Refined wheat flour (maida) as base', 'High sodium — up to 800 mg per serving', 'Contains MSG and artificial flavours', 'TBHQ preservative linked to health concerns', 'Low fiber content'],
      healthRating: 'good', healthLabel: 'Homemade — Much Healthier'
    },
    alternatives: [
      {
        name: 'Seviyan (Vermicelli) Upma',
        icon: '🍝',
        tagline: 'Roasted vermicelli with vegetables — ready in 10 min',
        ingredients: ['1 cup roasted seviyan (vermicelli)', '1 onion, sliced', '½ cup green peas', '1 carrot, finely diced', '2 tbsp ghee or oil', '1 tsp mustard seeds', '1 tsp cumin seeds', '8–10 curry leaves', '1 green chilli, slit', 'Salt to taste', '2 cups water', 'Fresh coriander to garnish'],
        steps: ['Heat ghee in a pan; add mustard seeds and cumin. Let them splutter.', 'Add curry leaves, green chilli, and sliced onion. Sauté until golden.', 'Add carrot and peas; stir-fry for 2 minutes.', 'Add roasted seviyan and toss to coat in the spiced oil.', 'Pour 2 cups water, add salt. Stir once and level it out.', 'Cover and cook on medium heat for 5–6 min until water is fully absorbed.', 'Fluff gently with a fork, garnish with coriander, and serve hot.']
      },
      {
        name: 'Vegetable Poha',
        icon: '🌾',
        tagline: 'Flattened rice with peas & turmeric — a classic Indian quick meal',
        ingredients: ['2 cups thick poha (flattened rice)', '1 onion, finely chopped', '½ cup green peas', '1 boiled potato, cubed', '2 tbsp oil', '1 tsp mustard seeds', '1 tsp turmeric powder', 'Juice of ½ lemon', 'Salt and a pinch of sugar', '2 tbsp roasted peanuts', 'Coriander and sev to garnish'],
        steps: ['Rinse poha in a strainer under water for 1–2 min. Drain and set aside.', 'Heat oil in a pan; add mustard seeds and let them splutter.', 'Add onion and cook until soft and translucent.', 'Add boiled potato, peas, turmeric, salt, and sugar. Mix well.', 'Add drained poha and roasted peanuts. Fold gently without breaking.', 'Cook on low heat for 3–4 minutes, stirring gently.', 'Squeeze lemon juice, garnish with coriander and sev. Serve immediately.']
      }
    ]
  },
  {
    keywords: ['oreo', 'biscuit', 'cookie', 'cream biscuit', 'chocolate biscuit', 'hide and seek', 'good day', 'parle'],
    name: 'Oreo / Packaged Biscuits', icon: '🍪',
    alternative: {
      name: 'Homemade Biscuit Alternatives', icon: '🌰',
      description: 'Packaged biscuits are primarily refined flour, palm oil, and refined sugar with emulsifiers. Homemade versions using whole wheat flour and natural sweeteners give you the same crunch and sweetness with real nutritional value.',
      benefits: ['Whole wheat flour instead of refined flour', 'Naturally sweetened with dates or jaggery', 'Walnuts and seeds add omega-3 fatty acids', 'No palm oil or hydrogenated fats', 'High fiber keeps you full longer'],
      packagedIssues: ['High refined sugar (3–4 g per cookie)', 'Palm oil as primary fat source', 'Refined wheat flour (maida)', 'Emulsifiers and artificial flavours', 'Zero fiber content'],
      healthRating: 'good', healthLabel: 'Homemade — Much Healthier'
    },
    alternatives: [
      {
        name: 'Whole Wheat Date & Walnut Cookies',
        icon: '🍪',
        tagline: 'Naturally sweet, crunchy cookies with no refined sugar',
        ingredients: ['1 cup whole wheat flour', '10 medjool dates, pitted', '½ cup walnuts, roughly chopped', '3 tbsp coconut oil or butter', '1 tsp vanilla extract', '¼ tsp baking powder', 'Pinch of salt'],
        steps: ['Blend pitted dates with 2 tbsp warm water into a smooth paste.', 'In a bowl, mix whole wheat flour, baking powder, and salt.', 'Add date paste, coconut oil, and vanilla. Mix into a soft dough.', 'Fold in chopped walnuts evenly.', 'Shape into small rounds and flatten on a parchment-lined tray.', 'Bake at 170°C (340°F) for 12–15 minutes until edges are golden.', 'Cool on a wire rack — they crisp up as they cool. Store in an airtight jar.']
      },
      {
        name: 'Atta-Coconut Ladoo',
        icon: '🟤',
        tagline: 'Roasted wheat & coconut balls sweetened with jaggery',
        ingredients: ['1 cup whole wheat flour (atta)', '½ cup desiccated coconut', '½ cup jaggery, grated', '4 tbsp ghee', '½ tsp cardamom powder', '2 tbsp chopped cashews or almonds', 'Pinch of salt'],
        steps: ['Heat ghee in a heavy pan on low heat.', 'Add whole wheat flour and roast, stirring constantly, for 8–10 min until golden and fragrant.', 'Add desiccated coconut and roast for another 2 minutes.', 'Remove from heat. Add jaggery, cardamom, nuts, and salt. Mix well.', 'Let the mixture cool for 5 minutes — it should be warm but handleable.', 'Grease your palms with ghee and shape into small round ladoos.', 'Store in an airtight container at room temperature for up to 2 weeks.']
      }
    ]
  },
  {
    keywords: ['lays', 'chips', 'potato chips', 'wafers', 'pringles', 'kurkure', 'puffcorn', 'namkeen', 'bhujia', 'cheetos'],
    name: 'Lays / Kurkure', icon: '🥔',
    alternative: {
      name: 'Homemade Snack Alternatives', icon: '🔥',
      description: 'Deep-fried chips with artificial seasonings and trans fats can be swapped with roasted makhana or homemade chivda — same satisfying crunch with protein, fiber, and zero artificial additives.',
      benefits: ['Makhana is high in protein and low in fat', 'Baked/roasted has 80% less oil', 'No artificial flavours, colours, or MSG', 'Rich in antioxidants and minerals', 'Contains complex carbs for steady energy'],
      packagedIssues: ['Deep fried in refined vegetable oil', 'Excessive sodium (up to 500 mg per pack)', 'Artificial flavours (E631, E627) and MSG', 'Low nutritional value — empty calories', 'Contains acrylamide from high-heat frying'],
      healthRating: 'good', healthLabel: 'Homemade — Much Healthier'
    },
    alternatives: [
      {
        name: 'Roasted Makhana (Fox Nuts)',
        icon: '⭕',
        tagline: 'Crispy spiced fox nuts — high protein guilt-free snack',
        ingredients: ['2 cups makhana (fox nuts)', '1 tbsp ghee or coconut oil', '½ tsp chaat masala', '¼ tsp black pepper', '¼ tsp turmeric', '¼ tsp red chilli powder', 'Salt to taste'],
        steps: ['Heat ghee in a wide pan on low-medium heat.', 'Add makhana and roast, stirring constantly, for 8–10 minutes until crispy.', 'Reduce heat to low. Add turmeric, red chilli powder, black pepper, and salt.', 'Toss well so every piece is coated in the spices.', 'Sprinkle chaat masala and give a final toss.', 'Spread on a plate to cool completely — they will crisp up further.', 'Store in an airtight container — stays crispy for up to 1 week.']
      },
      {
        name: 'Homemade Chivda (Poha Mix)',
        icon: '🌾',
        tagline: 'Crispy flattened rice mix with peanuts & spices',
        ingredients: ['2 cups thin poha (flattened rice)', '¼ cup roasted peanuts', '¼ cup roasted chana dal', '2 tbsp oil', '1 tsp mustard seeds', '8–10 curry leaves', '½ tsp turmeric', '½ tsp red chilli powder', '1 tsp sugar', 'Salt to taste'],
        steps: ['Dry roast thin poha in a pan on low heat for 6–8 minutes, stirring constantly, until crispy. Set aside.', 'Heat oil in a large pan; add mustard seeds and curry leaves.', 'Add turmeric and red chilli powder — stir for 10 seconds.', 'Add roasted peanuts and chana dal; toss for 1 minute.', 'Add the crispy poha, sugar, and salt. Mix everything gently.', 'Cook on low heat for 2 minutes, stirring continuously.', 'Cool completely before storing in an airtight container for up to 2 weeks.']
      }
    ]
  },
  {
    keywords: ['coca cola', 'coke', 'pepsi', 'soda', 'soft drink', 'sprite', 'fanta', 'mountain dew', 'sting', 'energy drink', 'red bull'],
    name: 'Coca Cola / Pepsi', icon: '🥤',
    alternative: {
      name: 'Homemade Drink Alternatives', icon: '🍋',
      description: 'Sugary carbonated drinks with phosphoric acid and artificial caramel colour can be replaced by fresh Indian drinks that hydrate, provide real vitamins, and taste even better.',
      benefits: ['Natural vitamin C from real lemon', 'Zero artificial sweeteners or colours', 'Hydrates while providing electrolytes', 'Mint and spices aid digestion', 'No phosphoric acid to leach calcium'],
      packagedIssues: ['9–10 teaspoons of sugar per can', 'Phosphoric acid weakens bones and teeth', 'Caramel colour contains 4-MEI (carcinogen)', 'Caffeine creates dependency', 'Zero nutritional value'],
      healthRating: 'good', healthLabel: 'Homemade — Much Healthier'
    },
    alternatives: [
      {
        name: 'Nimbu Pani with Mint & Black Salt',
        icon: '🍋',
        tagline: 'Classic Indian lemonade — refreshing, vitamin-rich, zero additives',
        ingredients: ['Juice of 2 fresh lemons', '1½ cups chilled water', '8–10 fresh mint leaves', '¼ tsp black salt (kala namak)', '¼ tsp roasted cumin powder', '1 tsp jaggery powder or honey (optional)', 'Ice cubes', 'Lemon slice for garnish'],
        steps: ['Muddle mint leaves gently in a glass or jug to release flavour.', 'Squeeze lemon juice directly over the mint.', 'Add black salt, roasted cumin powder, and jaggery (if using).', 'Pour in chilled water and stir well until jaggery dissolves.', 'Add a generous amount of ice cubes.', 'Taste and adjust lemon or sweetness to your preference.', 'Garnish with a lemon slice and mint sprig. Serve immediately.']
      },
      {
        name: 'Aam Panna (Raw Mango Drink)',
        icon: '🥭',
        tagline: 'Tangy raw mango cooler — a summer immunity booster',
        ingredients: ['2 raw (green) mangoes', '4 cups water', '4 tbsp jaggery or sugar', '1 tsp black salt', '1 tsp roasted cumin powder', '½ tsp black pepper', '8–10 mint leaves', 'Ice cubes'],
        steps: ['Boil or pressure cook raw mangoes until soft (about 10–15 min).', 'Let them cool, then peel and squeeze out all the pulp into a bowl.', 'Blend the pulp with jaggery, black salt, cumin powder, and black pepper.', 'Add 2 cups water and blend to a smooth concentrate.', 'Pour concentrate into a jug; add remaining 2 cups chilled water.', 'Add mint leaves and stir. Taste and adjust sweetness or tang.', 'Serve over ice cubes. Stores in fridge for 3–4 days.']
      }
    ]
  },
  {
    keywords: ['bournvita', 'horlicks', 'complan', 'malted drink', 'milk powder drink', 'boost'],
    name: 'Bournvita / Horlicks', icon: '☕',
    alternative: {
      name: 'Homemade Drink Alternatives', icon: '🥛',
      description: 'Malted drinks are marketed as health foods but refined sugar is their top ingredient. Traditional Indian drinks like sattu and haldi doodh are genuinely nutritious alternatives with real vitamins, protein, and anti-inflammatory benefits.',
      benefits: ['Sattu provides 20 g plant protein per serving', 'No added refined sugar', 'Rich in natural iron, calcium, and magnesium', 'Turmeric has proven anti-inflammatory benefits', 'Provides stable energy without sugar spikes'],
      packagedIssues: ['Refined sugar is the 2nd or 3rd ingredient', 'Added malt extract is essentially sugar', 'Contains artificial flavours and colours', 'Health claims mislead consumers', 'Key nutrients overshadowed by sugar content'],
      healthRating: 'good', healthLabel: 'Homemade — Much Healthier'
    },
    alternatives: [
      {
        name: 'Sattu Drink (Roasted Gram Flour)',
        icon: '💪',
        tagline: 'Traditional protein powerhouse — 20g protein, zero additives',
        ingredients: ['3 tbsp sattu (roasted black gram flour)', '1 glass chilled water or warm milk', '¼ tsp black salt', 'Squeeze of ½ lemon', '1 tsp jaggery or honey (optional)', '¼ tsp roasted cumin powder'],
        steps: ['Add sattu to a tall glass.', 'Add black salt, cumin powder, and lemon juice.', 'Pour a little water and mix into a smooth paste — no lumps.', 'Add remaining water (cold for summer, warm milk for winter).', 'Sweeten with jaggery or honey if desired.', 'Stir vigorously with a spoon or shake in a bottle.', 'Drink immediately for maximum protein and iron benefit.']
      },
      {
        name: 'Haldi Doodh (Golden Milk)',
        icon: '🌟',
        tagline: 'Turmeric-spiced warm milk — anti-inflammatory & sleep-promoting',
        ingredients: ['1 cup full-fat milk (or almond milk)', '½ tsp turmeric powder', '¼ tsp cinnamon powder', '¼ tsp ginger powder (or fresh grated)', 'Pinch of black pepper', '1 tsp honey or jaggery', 'Pinch of cardamom (optional)'],
        steps: ['Pour milk into a small saucepan over medium heat.', 'Add turmeric, cinnamon, ginger powder, and black pepper.', 'Whisk or stir continuously as the milk heats.', 'Bring to a gentle simmer — do not boil.', 'Remove from heat and add honey or jaggery. Stir well.', 'Add a pinch of cardamom for extra flavour if desired.', 'Pour into a mug and drink warm before bed for best results.']
      }
    ]
  },
  {
    keywords: ['pasta', 'macaroni', 'spaghetti', 'penne', 'instant pasta'],
    name: 'Instant Pasta', icon: '🍝',
    alternative: {
      name: 'Homemade Pasta Alternatives', icon: '🥦',
      description: 'Packaged instant pasta uses refined flour and high-sodium seasoning mixes. Homemade whole wheat pasta or daliya khichdi gives you all the comfort with fiber, vitamins, and no preservatives.',
      benefits: ['Whole wheat retains bran, germ, and nutrients', 'Homemade sauce has real tomatoes, no added sugar', 'Zero preservatives or artificial colours', 'Seasonal vegetables add vitamins and minerals', 'Full control over sodium levels'],
      packagedIssues: ['Made from refined flour (maida)', 'Seasoning mix contains high sodium and sugar', 'May contain artificial colours and flavours', 'Low protein and fiber content', 'Often contains palm oil'],
      healthRating: 'good', healthLabel: 'Homemade — Much Healthier'
    },
    alternatives: [
      {
        name: 'Whole Wheat Pasta with Fresh Tomato Sauce',
        icon: '🍝',
        tagline: 'Real tomato basil sauce on whole wheat — nutritious comfort food',
        ingredients: ['200 g whole wheat pasta', '3 ripe tomatoes, blanched & pureed', '4 garlic cloves, minced', '1 onion, finely chopped', '½ cup bell peppers, diced', '½ cup broccoli florets', '2 tbsp olive oil', '1 tsp dried basil or oregano', 'Salt and black pepper to taste', 'Fresh basil for garnish'],
        steps: ['Boil pasta in salted water until al dente (8–10 min). Drain and set aside.', 'Heat olive oil in a pan. Sauté garlic until fragrant (30 seconds).', 'Add onion and cook until translucent. Add bell peppers and broccoli.', 'Pour in tomato puree and cook for 5 minutes. Season with basil, salt, and pepper.', 'Add cooked pasta to the sauce and toss well to coat.', 'Simmer for 2 minutes so pasta absorbs the sauce flavour.', 'Serve hot, garnished with fresh basil leaves.']
      },
      {
        name: 'Daliya Khichdi (Broken Wheat)',
        icon: '🌾',
        tagline: 'Protein-packed one-pot broken wheat with lentils & vegetables',
        ingredients: ['½ cup daliya (broken wheat)', '¼ cup yellow moong dal', '1 carrot, diced', '½ cup green peas', '1 onion, chopped', '1 tomato, chopped', '1 tbsp ghee', '1 tsp cumin seeds', '½ tsp turmeric', '½ tsp garam masala', 'Salt to taste', '3 cups water'],
        steps: ['Dry roast daliya in a pan for 3–4 minutes until lightly golden. Set aside.', 'Wash moong dal and set aside.', 'Heat ghee in a pressure cooker; add cumin seeds, then onion. Sauté until golden.', 'Add tomato and cook until mushy.', 'Add all vegetables, turmeric, and garam masala. Mix well.', 'Add daliya, moong dal, salt, and 3 cups water. Stir everything together.', 'Pressure cook for 2–3 whistles. Open when pressure releases. Serve hot with curd.']
      }
    ]
  },
  {
    keywords: ['pizza', 'frozen pizza', 'dominos', 'pizza base'],
    name: 'Frozen Pizza', icon: '🍕',
    alternative: {
      name: 'Homemade Pizza Alternatives', icon: '🧀',
      description: 'Frozen pizzas use refined flour crust, processed cheese, and preservatives. Homemade whole wheat base pizzas or besan chilla pizzas are ready in under 15 minutes and are genuinely nutritious.',
      benefits: ['Whole wheat base provides fiber and B vitamins', 'Real cheese for calcium and protein', 'Fresh vegetables add vitamins and antioxidants', 'No preservatives or artificial flavours', 'Control sodium and oil entirely'],
      packagedIssues: ['Refined flour crust — simple carbs, low fiber', 'Processed cheese with emulsifiers', 'High sodium (over 1000 mg per pizza)', 'Preservatives in toppings and sauce', 'Added sugar in pizza sauce'],
      healthRating: 'good', healthLabel: 'Homemade — Much Healthier'
    },
    alternatives: [
      {
        name: 'Whole Wheat Roti Pizza',
        icon: '🍕',
        tagline: 'Crispy whole wheat base with fresh toppings — ready in 12 min',
        ingredients: ['2 whole wheat rotis or whole wheat pita', '3 tbsp homemade tomato puree', '1 tsp olive oil', '½ tsp dried oregano', '½ cup grated mozzarella or paneer', 'Toppings: bell peppers, onion, tomato, corn, olives', 'Fresh basil and chilli flakes to finish'],
        steps: ['Mix tomato puree with olive oil and oregano to make the quick sauce.', 'Spread sauce generously over each whole wheat roti.', 'Add your chosen vegetables evenly over the sauce.', 'Top with grated mozzarella or crumbled paneer.', 'Place on a baking tray and bake at 200°C for 8–10 minutes until cheese melts.', 'Alternatively, heat in a covered tawa on medium heat for 5 minutes.', 'Finish with fresh basil and chilli flakes. Slice and serve immediately.']
      },
      {
        name: 'Besan Chilla Pizza',
        icon: '🫓',
        tagline: 'High-protein chickpea flour base with veggies — gluten-free option',
        ingredients: ['1 cup besan (chickpea flour)', '¼ tsp turmeric', '¼ tsp cumin powder', 'Salt and green chilli to taste', 'Water to make a thin batter', '2 tbsp homemade tomato chutney', 'Toppings: capsicum, onion, sweet corn, grated paneer', '1 tbsp oil for cooking'],
        steps: ['Mix besan with turmeric, cumin, salt, and enough water to make a thin, smooth batter.', 'Heat a non-stick tawa; brush with a little oil.', 'Pour a ladle of batter and spread into a thin circle.', 'Cook on medium heat for 2 minutes until the surface looks dry.', 'Flip and spread tomato chutney on the cooked side.', 'Add toppings and grated paneer over the chutney layer.', 'Cover with a lid for 2 minutes until paneer melts slightly. Fold and serve hot.']
      }
    ]
  },
  {
    keywords: ['nutella', 'chocolate spread', 'hazelnut spread'],
    name: 'Nutella / Chocolate Spread', icon: '🍫',
    alternative: {
      name: 'Homemade Spread Alternatives', icon: '🥜',
      description: 'Nutella is primarily sugar and palm oil with very little hazelnut. Homemade nut butters with pure cacao give you the rich chocolate flavour with actual nutritional value.',
      benefits: ['Almonds provide protein, vitamin E, and healthy fats', 'Pure cacao is rich in antioxidants', 'No palm oil or hydrogenated fats', 'Natural sweeteners — you control the amount', 'High satiety from real nuts'],
      packagedIssues: ['First ingredient is sugar (over 55% by weight)', 'Palm oil is the second ingredient', 'Actual hazelnut content is only ~13%', 'Contains vanillin (artificial vanilla)', 'Zero fiber and minimal protein'],
      healthRating: 'good', healthLabel: 'Homemade — Much Healthier'
    },
    alternatives: [
      {
        name: 'Dark Chocolate Almond Butter',
        icon: '🥜',
        tagline: 'Roasted almonds blended with pure cacao — nutritious & rich',
        ingredients: ['1 cup raw almonds', '2 tbsp pure cacao powder (unsweetened)', '2 tbsp honey or maple syrup', '1 tbsp coconut oil', 'Pinch of sea salt', '½ tsp vanilla extract (optional)'],
        steps: ['Dry roast almonds at 160°C for 10 minutes until fragrant. Cool for 5 minutes.', 'Transfer to a high-speed blender or food processor.', 'Blend for 2–3 minutes until almonds release oils and form creamy butter.', 'Add cacao powder, honey, coconut oil, sea salt, and vanilla.', 'Blend again for 1–2 minutes until silky smooth.', 'Taste and adjust sweetness to your liking.', 'Store in a glass jar in the fridge for up to 2 weeks.']
      },
      {
        name: 'Peanut Butter with Cacao & Honey',
        icon: '🍯',
        tagline: 'No-blender chocolate peanut butter — simple & wholesome',
        ingredients: ['½ cup natural peanut butter (no sugar added)', '1 tbsp pure cacao powder', '1 tbsp honey', '½ tsp cinnamon', 'Pinch of sea salt', '1 tbsp warm water (to adjust consistency)'],
        steps: ['Add peanut butter to a bowl.', 'Sift in cacao powder to avoid lumps.', 'Add honey, cinnamon, and sea salt.', 'Mix thoroughly with a spoon until fully combined.', 'Add warm water if needed to reach a spreadable consistency.', 'Taste and add more honey or cacao as preferred.', 'Store in a sealed jar in the fridge for up to 2 weeks.']
      }
    ]
  },
  {
    keywords: ['ketchup', 'tomato sauce', 'tomato ketchup', 'maggi sauce', 'chilli sauce'],
    name: 'Tomato Ketchup', icon: '🍅',
    alternative: {
      name: 'Homemade Sauce Alternatives', icon: '🌶️',
      description: 'Store-bought ketchup is tomato paste mixed with high-fructose corn syrup and preservatives. Homemade chutneys are intensely flavourful with real ingredients and zero additives.',
      benefits: ['Made from real, fresh tomatoes', 'No high-fructose corn syrup or refined sugar', 'Garlic and ginger provide immune-boosting compounds', 'Zero preservatives or artificial colours', 'Customizable with healthy spices like turmeric'],
      packagedIssues: ['Contains high-fructose corn syrup or refined sugar', 'Preservatives like sodium benzoate', 'Artificial colouring to maintain red appearance', 'Very low actual tomato content', 'High sodium to sugar ratio'],
      healthRating: 'good', healthLabel: 'Homemade — Much Healthier'
    },
    alternatives: [
      {
        name: 'Tomato-Ginger Chutney',
        icon: '🍅',
        tagline: 'Tangy fresh tomato chutney with garlic & ginger — no preservatives',
        ingredients: ['4 ripe tomatoes, roughly chopped', '4 garlic cloves', '1-inch ginger piece', '1 green chilli (adjust to taste)', '1 tbsp oil', '½ tsp cumin seeds', '½ tsp red chilli powder', '¼ tsp turmeric', 'Salt to taste', '1 tsp jaggery or honey'],
        steps: ['Heat oil in a pan; add cumin seeds and let them splutter.', 'Add garlic, ginger, and green chilli. Sauté for 1 minute.', 'Add tomatoes, turmeric, red chilli powder, and salt.', 'Cook on medium heat for 10–12 min, stirring, until tomatoes break down.', 'Add jaggery and stir. Cook for 2 more minutes.', 'Cool slightly, then blend to smooth or chunky as preferred.', 'Store in a glass jar in the fridge for up to 5 days.']
      },
      {
        name: 'Mint-Coriander Chutney',
        icon: '🌿',
        tagline: 'Fresh green chutney — pairs with everything, ready in 5 min',
        ingredients: ['1 cup fresh mint leaves', '1 cup fresh coriander leaves and stems', '2 green chillies', '1-inch ginger piece', '2 tbsp lemon juice', '1 tsp cumin seeds', '1 small garlic clove', 'Salt to taste', '1 tsp jaggery or sugar'],
        steps: ['Wash mint and coriander thoroughly.', 'Add all ingredients to a blender.', 'Add 2–3 tbsp water to help blend.', 'Blend to a smooth, vibrant green paste.', 'Taste and adjust lemon, salt, or chilli to your preference.', 'Transfer to a glass jar. Store in the fridge for up to 1 week.', 'Serve with snacks, sandwiches, or as a dip instead of ketchup.']
      }
    ]
  },
  {
    keywords: ['ice cream', 'vanilla', 'chocolate ice cream', 'cone', 'kulfi', 'frozen dessert'],
    name: 'Packaged Ice Cream', icon: '🍦',
    alternative: {
      name: 'Homemade Frozen Dessert Alternatives', icon: '🥭',
      description: 'Packaged ice creams use stabilisers, emulsifiers, and vegetable fat instead of real cream. Traditional kulfi or banana nice cream give you rich, creamy desserts with real ingredients.',
      benefits: ['Probiotic benefits from real yogurt', 'No stabilisers, guar gum, or cellulose gum', 'Real fruit for natural sweetness and vitamins', 'No hydrogenated vegetable fats or palm oil', 'Higher protein content from milk or yogurt base'],
      packagedIssues: ['Uses hydrogenated vegetable fat instead of cream', 'Stabilisers and emulsifiers (E471, E412, E410)', 'High sugar content (20–30 g per serving)', 'Artificial flavours and colours', 'Low milk solids — mostly air and additives'],
      healthRating: 'good', healthLabel: 'Homemade — Much Healthier'
    },
    alternatives: [
      {
        name: 'Mango Kulfi',
        icon: '🥭',
        tagline: 'Creamy traditional frozen kulfi with real mango and saffron',
        ingredients: ['1 cup full-fat milk', '½ cup condensed milk (or jaggery to taste)', '1 cup fresh mango pulp', '½ tsp cardamom powder', 'A few saffron strands soaked in 1 tbsp warm milk', '2 tbsp chopped pistachios'],
        steps: ['Heat full-fat milk in a heavy pan on medium heat.', 'Stir continuously and simmer for 15–20 min until milk reduces by one-third.', 'Add condensed milk (or jaggery), saffron milk, and cardamom. Mix well.', 'Cool to room temperature, then blend in fresh mango pulp.', 'Pour into kulfi moulds or small cups.', 'Sprinkle chopped pistachios on top. Cover with foil.', 'Freeze for at least 5–6 hours or overnight. Unmould and serve.']
      },
      {
        name: 'Frozen Banana Nice Cream',
        icon: '🍌',
        tagline: 'Creamy, one-ingredient ice cream — naturally sweet, dairy-free',
        ingredients: ['3 very ripe bananas, sliced and frozen overnight', '2 tbsp peanut butter (optional)', '1 tbsp pure cacao powder (optional for chocolate flavour)', 'Pinch of cardamom', 'Toppings: nuts, berries, dark chocolate chips'],
        steps: ['Slice ripe bananas and freeze in a single layer for at least 6 hours.', 'Remove frozen banana slices and let sit for 3 minutes.', 'Transfer to a food processor or high-speed blender.', 'Blend, stopping to scrape down sides, for 2–3 minutes until creamy.', 'Add peanut butter or cacao powder if desired. Blend again briefly.', 'Serve immediately as soft-serve OR freeze for 1 hour for a firmer scoop.', 'Top with nuts, berries, or dark chocolate chips and serve.']
      }
    ]
  },
  {
    keywords: ['cake', 'cupcake', 'pastry', 'brownie', 'muffin'],
    name: 'Packaged Cake / Brownie', icon: '🍰',
    alternative: {
      name: 'Homemade Baked Alternatives', icon: '🍌',
      description: 'Packaged cakes use refined flour, palm oil, and preservatives. Homemade banana muffins or ragi brownies are naturally sweetened, high in fiber, and require no preservatives.',
      benefits: ['Whole wheat flour and oats — high fiber', 'Naturally sweetened with ripe bananas or dates', 'Coconut oil instead of hydrogenated fats', 'No preservatives, emulsifiers, or artificial colours', 'Can be made eggless for plant-based diets'],
      packagedIssues: ['Refined flour as primary ingredient', 'Palm oil or hydrogenated fats for texture', 'Preservatives like calcium propionate', 'Emulsifiers (E471, E472) for shelf stability', 'High sugar content with zero nutritional value'],
      healthRating: 'good', healthLabel: 'Homemade — Much Healthier'
    },
    alternatives: [
      {
        name: 'Banana Oat Muffins (No Sugar)',
        icon: '🍌',
        tagline: 'Naturally sweetened muffins with oats — no refined sugar needed',
        ingredients: ['3 very ripe bananas, mashed', '1 cup whole wheat flour', '½ cup rolled oats', '2 tbsp coconut oil, melted', '1 egg (or 1 tbsp flaxseed + 3 tbsp water for vegan)', '1 tsp baking soda', '1 tsp cinnamon', 'Pinch of salt', 'Optional: dark chocolate chips or walnuts'],
        steps: ['Preheat oven to 180°C (350°F). Line a muffin tray with paper cups.', 'Mash ripe bananas thoroughly in a bowl.', 'Add coconut oil and egg (or flax egg). Mix well.', 'Fold in whole wheat flour, oats, baking soda, cinnamon, and salt.', 'Gently fold in chocolate chips or walnuts if using.', 'Spoon batter into muffin cups, filling each ¾ full.', 'Bake for 18–22 minutes until a toothpick comes out clean. Cool before eating.']
      },
      {
        name: 'Ragi (Finger Millet) Chocolate Cake',
        icon: '🍫',
        tagline: 'Calcium-rich ragi flour chocolate cake sweetened with jaggery',
        ingredients: ['1 cup ragi (finger millet) flour', '¼ cup pure cacao powder', '½ cup jaggery, powdered', '½ cup yogurt', '¼ cup coconut oil or butter', '1 tsp baking powder', '½ tsp baking soda', '1 tsp vanilla extract', '½ cup warm water or milk'],
        steps: ['Preheat oven to 175°C (350°F). Grease a baking tin.', 'Mix ragi flour, cacao powder, baking powder, and baking soda in a bowl.', 'In another bowl, whisk together yogurt, coconut oil, powdered jaggery, and vanilla.', 'Combine wet and dry ingredients. Add warm water gradually to get a smooth batter.', 'Pour batter into the greased tin and tap to remove air bubbles.', 'Bake for 25–30 minutes until a toothpick inserted in the centre comes out clean.', 'Cool completely before slicing. Dust with cacao powder or top with fresh berries.']
      }
    ]
  },
  {
    keywords: ['samosa', 'frozen samosa', 'spring roll', 'frozen snack'],
    name: 'Frozen Samosa / Spring Roll', icon: '🥟',
    alternative: {
      name: 'Homemade Snack Alternatives', icon: '🫓',
      description: 'Frozen samosas are deep-fried in refined flour and contain preservatives. Homemade baked samosas or vegetable cutlets use whole wheat and less oil with far better nutritional value.',
      benefits: ['Whole wheat atta instead of refined maida', 'Baked — 80% less oil than deep-fried', 'Real vegetable filling with protein and fiber', 'No preservatives or artificial flavours', 'Use quality oils — ghee or cold-pressed oil'],
      packagedIssues: ['Deep-fried in repeatedly heated oil', 'Refined flour (maida) with zero fiber', 'Preservatives added for long shelf life', 'High trans fats from reused oil', 'Excess sodium in seasoning'],
      healthRating: 'good', healthLabel: 'Homemade — Much Healthier'
    },
    alternatives: [
      {
        name: 'Baked Whole Wheat Samosa',
        icon: '🥟',
        tagline: 'Classic samosa with whole wheat dough, baked not fried',
        ingredients: ['1 cup whole wheat flour (atta)', '2 tbsp oil + extra for brushing', 'Water to knead dough', '2 potatoes, boiled and mashed', '½ cup green peas', '100 g paneer, crumbled', '1 tsp cumin seeds', '1 tsp garam masala', '1 tsp amchur (dry mango powder)', 'Salt and green chilli to taste'],
        steps: ['Knead atta with oil, salt, and water into a firm dough. Rest for 20 minutes.', 'Sauté cumin seeds, add peas; mix in mashed potato, paneer, garam masala, amchur, and salt.', 'Divide dough into balls; roll each into a thin oval and cut in half.', 'Form a cone from each half, fill with stuffing, and seal edges with water.', 'Brush all samosas with oil on both sides.', 'Bake at 200°C (390°F) for 20–25 min, flipping once, until golden and crisp.', 'Serve hot with mint-coriander chutney.']
      },
      {
        name: 'Baked Vegetable Cutlet',
        icon: '🫓',
        tagline: 'Crispy veggie cutlet packed with protein — pan-baked, no deep frying',
        ingredients: ['2 boiled potatoes, mashed', '½ cup boiled green peas', '½ cup grated carrot', '2 tbsp besan (chickpea flour)', '1 tbsp chopped coriander', '1 tsp chaat masala', '½ tsp garam masala', 'Salt to taste', '1 tbsp oil for brushing'],
        steps: ['Mix all ingredients together in a bowl until a firm dough forms.', 'If too sticky, add a little more besan.', 'Shape into oval or round cutlets.', 'Brush both sides with oil.', 'Place on a baking tray lined with parchment paper.', 'Bake at 200°C for 20–25 minutes, flipping halfway, until golden and crisp.', 'Serve hot with mint chutney or inside a whole wheat bread.']
      }
    ]
  },
  {
    keywords: ['mithai', 'sweet', 'barfi', 'laddu', 'rasgulla', 'gulab jamun', 'jalebi', 'soan papdi', 'halwa'],
    name: 'Packaged Indian Sweets', icon: '🍬',
    alternative: {
      name: 'Homemade Sweet Alternatives', icon: '🌰',
      description: 'Packaged mithai is loaded with refined sugar, vanaspati, and substandard ingredients. Homemade sweets using dates, ragi, and dry fruits satisfy cravings naturally with real nutrition.',
      benefits: ['Dates provide natural sweetness with fiber and minerals', 'Sesame seeds are rich in calcium and iron', 'No refined sugar or artificial sweeteners', 'Healthy fats from nuts instead of vanaspati', 'High energy with actual nutritional value'],
      packagedIssues: ['Up to 60–70% sugar by weight', 'Often uses vanaspati (hydrogenated fat) instead of ghee', 'Artificial colours for visual appeal', 'Preservatives like potassium sorbate', 'Low protein despite being milk-based'],
      healthRating: 'good', healthLabel: 'Homemade — Much Healthier'
    },
    alternatives: [
      {
        name: 'Dry Fruit & Sesame Laddu',
        icon: '🌰',
        tagline: 'Dates, almonds & sesame — naturally sweet energy balls',
        ingredients: ['1 cup dates, pitted', '½ cup almonds', '¼ cup sesame seeds (til)', '¼ cup desiccated coconut', '¼ cup cashews or walnuts', '1 tsp cardamom powder', '1 tbsp ghee'],
        steps: ['Dry roast sesame seeds and coconut separately until lightly golden. Set aside.', 'Dry roast almonds and cashews until fragrant. Cool and coarsely chop.', 'Blend dates in a food processor until a sticky paste forms.', 'Heat ghee in a pan; add date paste and cook for 2 minutes on low heat.', 'Remove from heat. Add all roasted ingredients and cardamom. Mix well.', 'Grease your palms with ghee and shape into laddus while still warm.', 'Store in an airtight container at room temperature for up to 2 weeks.']
      },
      {
        name: 'Ragi Halwa',
        icon: '🟤',
        tagline: 'Calcium-rich finger millet halwa sweetened with jaggery',
        ingredients: ['1 cup ragi (finger millet) flour', '3 tbsp ghee', '½ cup jaggery, grated', '2 cups water or milk', '½ tsp cardamom powder', '2 tbsp chopped mixed nuts (cashews, almonds)', 'A few raisins'],
        steps: ['Heat 1 tbsp ghee in a pan; add ragi flour and roast on low heat for 5–6 min until fragrant.', 'Remove roasted ragi from pan and set aside.', 'In the same pan, add remaining ghee and lightly fry nuts and raisins.', 'Add water (or milk) to the pan and bring to a gentle simmer.', 'Add jaggery and stir until it dissolves completely.', 'Slowly add roasted ragi flour, stirring continuously to avoid lumps.', 'Cook on low heat for 4–5 min until halwa thickens and leaves pan sides. Add cardamom and serve hot.']
      }
    ]
  },
  {
    keywords: ['burger', 'frozen burger', 'patty', 'aloo tikki burger'],
    name: 'Frozen Burger / Aloo Tikki', icon: '🍔',
    alternative: {
      name: 'Homemade Burger Alternatives', icon: '🧆',
      description: 'Frozen burger patties are deep-fried with binders and preservatives. Homemade besan or rajma tikkis are protein-rich, pan-cooked with minimal oil, and far more nutritious.',
      benefits: ['Besan and rajma are high in protein and fiber', 'No deep frying — pan fry or bake with minimal oil', 'Real vegetable content throughout', 'Zero preservatives or artificial binders', 'Whole wheat bun replaces refined flour bun'],
      packagedIssues: ['Deep-fried patty with high fat content', 'Preservatives and artificial binders (E471, E412)', 'Refined flour bun', 'High sodium and sugar content', 'Low vegetable content despite branding'],
      healthRating: 'good', healthLabel: 'Homemade — Much Healthier'
    },
    alternatives: [
      {
        name: 'Besan Tikki Burger',
        icon: '🧆',
        tagline: 'Protein-rich chickpea flour patty in a whole wheat bun',
        ingredients: ['1 cup besan (chickpea flour)', '1 boiled potato, mashed', '½ cup grated carrot and beet', '2 tbsp chopped coriander', '1 tsp chaat masala', '½ tsp cumin powder', 'Salt and green chilli to taste', '1 tbsp oil for pan-frying', 'Whole wheat buns, lettuce, tomato, onion, mint chutney'],
        steps: ['Mix besan, mashed potato, grated vegetables, coriander, and all spices into a firm dough.', 'Divide into equal portions and flatten into tikki shapes.', 'Heat oil in a non-stick pan on medium heat.', 'Cook tikkis for 3–4 min on each side until deep golden and crispy.', 'Toast the whole wheat bun on the same pan.', 'Assemble: spread mint chutney on bun, add lettuce, tikki, tomato, and onion.', 'Serve immediately with a squeeze of lemon.']
      },
      {
        name: 'Rajma (Kidney Bean) Patty Burger',
        icon: '🍔',
        tagline: 'High-fiber kidney bean patty — protein-packed plant burger',
        ingredients: ['1 cup cooked rajma (kidney beans), drained', '1 boiled potato, mashed', '2 tbsp bread crumbs or besan', '1 onion, finely chopped', '2 garlic cloves, minced', '1 tsp cumin powder', '1 tsp paprika', 'Salt and black pepper', '1 tbsp oil', 'Whole wheat buns and your favourite toppings'],
        steps: ['Mash cooked rajma roughly — leave some texture, not completely smooth.', 'Mix with mashed potato, onion, garlic, cumin, paprika, salt, and pepper.', 'Add bread crumbs or besan to bind the mixture.', 'Shape into patties and refrigerate for 20 min to firm up.', 'Heat oil in a pan; cook patties for 4 min on each side until golden.', 'Toast whole wheat buns lightly.', 'Assemble with your favourite vegetables and chutney. Serve hot.']
      }
    ]
  },
  {
    keywords: ['jam', 'marmalade', 'fruit jam', 'strawberry jam', 'mixed fruit jam'],
    name: 'Fruit Jam', icon: '🍓',
    alternative: {
      name: 'Homemade Preserve Alternatives', icon: '🫐',
      description: 'Commercial jams have very little actual fruit (20–30%) with sugar as the primary ingredient. Homemade chia seed preserves or date spreads contain 80–90% real fruit with natural sweetness.',
      benefits: ['High actual fruit content (80–90%)', 'Chia seeds add omega-3, fiber, and protein', 'No refined sugar — honey or dates if needed', 'No artificial pectin, colours, or preservatives', 'Antioxidants from real fruits preserved naturally'],
      packagedIssues: ['Only 20–30% actual fruit content', 'Sugar is the primary ingredient', 'Added pectin and citric acid', 'Artificial colours to enhance appearance', 'Preservatives like sodium benzoate'],
      healthRating: 'good', healthLabel: 'Homemade — Much Healthier'
    },
    alternatives: [
      {
        name: 'Chia Seed Fruit Preserve',
        icon: '🫐',
        tagline: 'Fresh berries + chia seeds — jam texture with omega-3',
        ingredients: ['2 cups fresh strawberries or mixed berries', '2 tbsp chia seeds', '2 tbsp honey or maple syrup', '1 tsp lemon juice', '¼ tsp vanilla extract (optional)'],
        steps: ['Wash and roughly chop the fruit.', 'Place in a small saucepan over medium heat. Mash lightly as it heats.', 'Cook for 5–7 minutes, stirring often, until fruit softens and releases juices.', 'Remove from heat. Stir in chia seeds, honey, and lemon juice.', 'Let sit for 5 minutes — chia creates a natural gel texture.', 'Taste and adjust sweetness. Add vanilla if using.', 'Cool completely and store in a glass jar in the fridge for up to 2 weeks.']
      },
      {
        name: 'Date & Fig Spread',
        icon: '🟫',
        tagline: 'Rich naturally sweet spread — no added sugar, high in iron & fiber',
        ingredients: ['1 cup dates, pitted', '½ cup dried figs', '½ cup warm water', '1 tsp lemon juice', '¼ tsp cinnamon', 'Pinch of salt'],
        steps: ['Soak pitted dates and dried figs in warm water for 30 minutes.', 'Transfer soaked fruit and soaking water to a blender.', 'Add lemon juice, cinnamon, and a pinch of salt.', 'Blend until completely smooth. Add more water if needed for spreadable consistency.', 'Taste and adjust — add lemon for tang or more cinnamon for warmth.', 'Transfer to a clean glass jar.', 'Store in the fridge for up to 3 weeks. Use on whole wheat bread, toast, or roti.']
      }
    ]
  },
  {
    keywords: ['protein bar', 'energy bar', 'granola bar', 'nutrition bar'],
    name: 'Protein Bar / Energy Bar', icon: '⚡',
    alternative: {
      name: 'Homemade Energy Snack Alternatives', icon: '🌰',
      description: 'Commercial protein bars often contain glucose syrup and processed protein isolates. Homemade energy bites and chikki use real whole-food ingredients for sustained energy.',
      benefits: ['Whole rolled oats for slow-release energy', 'Peanut butter provides healthy fats and natural protein', 'Flaxseed adds omega-3 and fiber', 'No processed protein isolates or sugar alcohols', 'High satiety — keeps you full for hours'],
      packagedIssues: ['Often contains glucose syrup or corn syrup', 'Processed protein isolates hard to digest', 'Sugar alcohols (maltitol, sorbitol) cause bloating', 'Artificial flavours and sweeteners', 'Overpriced for minimal real nutrition'],
      healthRating: 'good', healthLabel: 'Homemade — Much Healthier'
    },
    alternatives: [
      {
        name: 'Oat & Nut Energy Bites',
        icon: '🌰',
        tagline: 'No-bake energy balls with oats, peanut butter & dark chocolate',
        ingredients: ['1 cup rolled oats', '½ cup natural peanut butter (no sugar added)', '3 tbsp honey or date syrup', '2 tbsp ground flaxseed', '2 tbsp dark chocolate chips (70%+ cacao)', '1 tsp vanilla extract', 'Pinch of salt'],
        steps: ['Combine all ingredients in a large mixing bowl.', 'Stir thoroughly until everything is evenly mixed and holds together.', 'If too dry, add more honey; if too wet, add more oats.', 'Refrigerate the mixture for 20–30 minutes to firm up.', 'Scoop tablespoon-sized portions and roll into balls with your palms.', 'Place on a parchment-lined tray and refrigerate for 30 more minutes.', 'Store in an airtight container in the fridge for up to 2 weeks.']
      },
      {
        name: 'Peanut Chikki (Groundnut Brittle)',
        icon: '🥜',
        tagline: 'Traditional jaggery & peanut brittle — iron-rich natural energy',
        ingredients: ['1 cup roasted peanuts, skinned', '½ cup jaggery, grated', '1 tbsp ghee', '¼ tsp cardamom powder', 'Pinch of salt', '1 tsp sesame seeds (optional)'],
        steps: ['Grease a flat plate or baking tray with ghee. Set aside.', 'Heat jaggery in a heavy-bottomed pan on medium heat, stirring continuously.', 'Cook until jaggery melts and becomes a thick syrup (about 4–5 min).', 'Test: drop a little syrup in cold water — it should form a hard ball.', 'Quickly add roasted peanuts, cardamom, salt, and sesame seeds. Mix fast.', 'Immediately pour onto the greased plate and spread thin with a spatula.', 'Let cool for 10 minutes, then break into pieces. Store in an airtight container.']
      }
    ]
  },
  {
    keywords: ['mayonnaise', 'salad cream', 'white sauce', 'pasta sauce'],
    name: 'Mayonnaise', icon: '🥚',
    alternative: {
      name: 'Homemade Dip Alternatives', icon: '🥬',
      description: 'Store-bought mayo uses refined vegetable oil and preservatives. Hung curd dips and avocado chutneys are creamy, probiotic-rich alternatives with genuine nutritional benefits.',
      benefits: ['Probiotics from hung curd aid digestion', 'High protein content from yogurt', 'No refined oils or hydrogenated fats', 'Calcium-rich and anti-inflammatory', 'No preservatives or artificial flavours'],
      packagedIssues: ['Refined soybean or canola oil as base', 'Contains preservatives like EDTA', 'High omega-6 to omega-3 ratio (inflammatory)', 'Pasteurised eggs lose nutritional value', 'Often contains added sugar'],
      healthRating: 'good', healthLabel: 'Homemade — Much Healthier'
    },
    alternatives: [
      {
        name: 'Hung Curd Dip with Herbs',
        icon: '🥛',
        tagline: 'Creamy probiotic dip with garlic & herbs — rich, healthy spread',
        ingredients: ['1 cup thick yogurt (hung curd / Greek yogurt)', '2 garlic cloves, minced or grated', '1 tbsp olive oil', '1 tbsp lemon juice', '1 tsp dried herbs (oregano, dill, or mint)', 'Salt and black pepper to taste', '1 tsp tahini (optional, for depth)'],
        steps: ['Hang regular yogurt in a muslin cloth for 2–3 hours to get hung curd, or use Greek yogurt.', 'In a bowl, whisk together hung curd, garlic, and olive oil until smooth.', 'Add lemon juice, dried herbs, salt, and pepper.', 'Stir in tahini if using for a richer, nuttier flavour.', 'Taste and adjust — more lemon for tang, more salt as needed.', 'Refrigerate for 30 minutes before serving for flavours to develop.', 'Use as sandwich spread, dip, or salad dressing. Stays fresh for 3–4 days.']
      },
      {
        name: 'Avocado-Coriander Chutney',
        icon: '🥑',
        tagline: 'Creamy avocado with Indian spices — a nutritious green spread',
        ingredients: ['1 ripe avocado', '½ cup fresh coriander leaves', '1 green chilli', '1 tbsp lemon juice', '1 small garlic clove', '¼ tsp cumin powder', 'Salt to taste', '2–3 tbsp water to adjust consistency'],
        steps: ['Scoop out avocado flesh into a blender.', 'Add coriander, green chilli, garlic, lemon juice, cumin, and salt.', 'Blend until smooth. Add water tablespoon by tablespoon for desired consistency.', 'Taste and adjust — more lemon for tang, more chilli for heat.', 'Transfer to a bowl. Press plastic wrap directly on the surface to prevent browning.', 'Refrigerate for up to 2 days.', 'Use as a spread, dip, or topping for toast, wraps, and salads.']
      }
    ]
  },
  {
    keywords: ['chocolate', 'dairy milk', 'kitkat', 'snickers', 'munch', 'perk', 'milkybar', 'candy'],
    name: 'Packaged Chocolate', icon: '🍫',
    alternative: {
      name: 'Homemade Chocolate Alternatives', icon: '🥜',
      description: 'Commercial chocolates are often loaded with refined sugar, vegetable oils (like palm oil), and artificial emulsifiers rather than real cocoa. Homemade date and nut truffles or dark chocolate bark provide the same satisfaction with genuine nutritional benefits and antioxidants.',
      benefits: ['Uses naturally sweet dates or jaggery instead of refined sugar', 'Real cocoa powder provides antioxidants', 'No palm oil or artificial emulsifiers (PGPR)', 'Nuts provide healthy fats and protein', 'Zero artificial flavours or colours'],
      packagedIssues: ['Sugar is usually the first ingredient', 'Contains palm oil or hydrogenated vegetable fats', 'Very low actual cocoa content (often below 10%)', 'Artificial emulsifiers like PGPR (E476)', 'Artificial vanilla flavouring instead of real extract'],
      healthRating: 'good', healthLabel: 'Homemade — Much Healthier'
    },
    alternatives: [
      {
        name: 'Date and Nut Cocoa Truffles',
        icon: '🌰',
        tagline: 'Rich, bite-sized chocolate truffles naturally sweetened with dates',
        ingredients: ['1 cup soft dates (pitted)', '1/2 cup roasted almonds or walnuts', '3 tbsp pure cocoa powder', '1 tbsp coconut oil', 'Pinch of sea salt', 'Desiccated coconut or extra cocoa for coating'],
        steps: ['Blend the roasted nuts in a food processor until finely crushed.', 'Add dates, cocoa powder, coconut oil, and salt. Blend until the mixture forms a sticky dough.', 'Take small portions and roll them into balls using your palms.', 'Roll the balls in desiccated coconut or cocoa powder to coat them.', 'Place on a tray and refrigerate for 30 minutes to set.', 'Store in an airtight container in the fridge for up to 2 weeks.']
      },
      {
        name: 'Dark Chocolate & Almond Bark',
        icon: '🍫',
        tagline: 'Crispy, pure dark chocolate treat with toasted almonds',
        ingredients: ['1 cup high-quality dark chocolate chips (70% cocoa or more) OR unsweetened cocoa mass + 2 tbsp honey', '1/2 cup toasted sliced almonds', '1 tsp coconut oil', 'A pinch of flaky sea salt'],
        steps: ['Melt the dark chocolate and coconut oil in a microwave (30-second bursts) or over a double boiler until smooth.', 'Stir in half of the toasted almonds.', 'Pour the melted chocolate onto a parchment-lined baking sheet and spread it evenly.', 'Sprinkle the remaining almonds and flaky sea salt on top.', 'Place in the refrigerator for about 1 hour until completely hardened.', 'Break into pieces and enjoy! Store in the fridge.']
      }
    ]
  }
];

// ============================================
// Fuzzy matching function
// ============================================
function findMatch(query) {
  const q = query.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ');
  
  // Pass 1: Exact Match
  for (const entry of foodDatabase) {
    const n = entry.name.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ');
    if (q === n) return entry;
    for (const keyword of entry.keywords) {
      const k = keyword.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ');
      if (q === k) return entry;
    }
  }

  // Pass 2: Substring Match
  for (const entry of foodDatabase) {
    const n = entry.name.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ');
    if (q.includes(n) || n.includes(q)) {
      if (n.length >= 3 && q.length >= 3) return entry;
    }
    for (const keyword of entry.keywords) {
      const k = keyword.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ');
      if (q.includes(k) || k.includes(q)) {
        if (k.length >= 3 && q.length >= 3) return entry;
      }
    }
  }
  return null;
}

// ============================================
// API endpoint
// ============================================

// ============================
// UI State
// ============================
let isLoading = false;

// ============================
// Core API Call
// ============================
async function fetchAlternative(foodName) {
  return new Promise((resolve, reject) => {
    // Simulate slight network delay for UI effect
    setTimeout(() => {
      if (!foodName || !foodName.trim()) {
        return reject(new Error('Please provide a food name.'));
      }
      const match = findMatch(foodName);
      if (match) {
        resolve({
          packagedFood: { name: match.name, icon: match.icon },
          alternative: match.alternative,
          alternatives: match.alternatives || []
        });
      } else {
        reject(new Error(`No alternative found for "${foodName}". Try a different name or product.`));
      }
    }, 600);
  });
}

// ============================
// UI Functions
// ============================

function findAlternative() {
  const input = document.getElementById('food-input');
  const query = input.value.trim();

  if (!query) { input.focus(); return; }
  if (isLoading) return;

  document.getElementById('results-section').classList.add('hidden');
  document.getElementById('notfound-section').classList.add('hidden');
  document.getElementById('loading-section').classList.remove('hidden');
  document.getElementById('loading-section').scrollIntoView({ behavior: 'smooth', block: 'start' });

  isLoading = true;
  updateButtonState(true);

  fetchAlternative(query)
    .then(data => {
      document.getElementById('loading-section').classList.add('hidden');
      if (data && data.alternative) {
        showResult(data);
      } else {
        showNotFound(query, 'The AI response was incomplete. Try a different product name.');
      }
    })
    .catch(err => {
      document.getElementById('loading-section').classList.add('hidden');
      console.error('Alternative fetch error:', err.message);
      showNotFound(query, `⚠️ ${err.message}`);
    })
    .finally(() => {
      isLoading = false;
      updateButtonState(false);
    });
}

function updateButtonState(loading) {
  const btn = document.getElementById('btn-find-alt');
  const span = btn.querySelector('span');

  if (loading) {
    btn.disabled = true;
    span.textContent = 'Searching...';
    btn.classList.add('loading');
  } else {
    btn.disabled = false;
    span.textContent = 'Find Homemade Alternatives';
    btn.classList.remove('loading');
  }
}

// ============================
// Main Result Renderer
// ============================
function showResult(data) {
  const container = document.getElementById('results-container');
  const alt  = data.alternative;
  const pkg  = data.packagedFood || { name: 'Packaged Food', icon: '📦' };
  const alts = data.alternatives || [];

  // ── Packaged Issues list ──
  const packagedListItems = (alt.packagedIssues || []).map(issue => `
    <li>
      <svg class="li-icon danger" width="15" height="15" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span>${escapeHtml(issue)}</span>
    </li>`).join('');

  // ── Homemade Benefits list ──
  const homemadeListItems = (alt.benefits || []).map(benefit => `
    <li>
      <svg class="li-icon good" width="15" height="15" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path d="M16 10L11 15L8 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>${escapeHtml(benefit)}</span>
    </li>`).join('');

  const healthBadgeClass = alt.healthRating === 'good' ? 'good' : alt.healthRating === 'warning' ? 'warning' : 'bad';

  // ── Recipe Cards ──
  let recipeCardsHTML = '';
  if (alts.length > 0) {
    const cards = alts.map((item, idx) => {
      const ingredientsHTML = (item.ingredients || []).map(ing => `
        <li class="ingredient-item">
          <span class="ingredient-dot"></span>
          <span>${escapeHtml(ing)}</span>
        </li>`).join('');

      const stepsHTML = (item.steps || []).map((step, i) => `
        <li class="step-item">
          <div class="step-number">${i + 1}</div>
          <p>${escapeHtml(step)}</p>
        </li>`).join('');

      return `
        <div class="recipe-card" id="recipe-card-${idx}">
          <div class="recipe-card-top">
            <div class="recipe-card-icon">${escapeHtml(item.icon || '🍽️')}</div>
            <div class="recipe-card-info">
              <h4>${escapeHtml(item.name)}</h4>
              <p class="recipe-card-tagline">${escapeHtml(item.tagline || '')}</p>
            </div>
          </div>

          <button class="recipe-toggle-btn" onclick="toggleRecipe(${idx})" id="toggle-btn-${idx}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 5H7C5.89 5 5 5.89 5 7V19C5 20.1 5.89 21 7 21H17C18.1 21 19 20.1 19 19V7C19 5.89 18.1 5 17 5H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>View Recipe</span>
            <svg class="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <div class="recipe-drawer hidden" id="recipe-drawer-${idx}">
            <div class="recipe-drawer-inner">
              <div class="recipe-col">
                <h5 class="recipe-col-title">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M9 5H7C5.89 5 5 5.89 5 7V19C5 20.1 5.89 21 7 21H17C18.1 21 19 20.1 19 19V7C19 5.89 18.1 5 17 5H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" stroke-width="2"/>
                    <path d="M9 12H15M9 16H12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Ingredients
                </h5>
                <ul class="ingredient-list">${ingredientsHTML}</ul>
              </div>

              <div class="recipe-col recipe-col-steps">
                <h5 class="recipe-col-title">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Steps
                </h5>
                <ol class="step-list">${stepsHTML}</ol>
              </div>
            </div>
          </div>
        </div>`;
    }).join('');

    recipeCardsHTML = `
      <div class="recipe-cards-section">
        <div class="recipe-cards-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="currentColor" fill-opacity="0.15"/>
            <path d="M3 12C3 7.03 7.03 3 12 3c2.39 0 4.56.87 6.22 2.28" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M21 12C21 16.97 16.97 21 12 21c-2.39 0-4.56-.87-6.22-2.28" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M12 8v4l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Try These Homemade Recipes</span>
        </div>
        <div class="recipe-cards-grid">
          ${cards}
        </div>
      </div>`;
  }

  // ── Full card HTML ──
  container.innerHTML = `
    <div class="alt-card">

      <div class="alt-card-header">
        <div class="alt-icon-wrap">${escapeHtml(pkg.icon || '📦')}</div>
        <div>
          <h3>Alternatives for <strong>${escapeHtml(pkg.name)}</strong></h3>
          <p class="alt-subtitle">${escapeHtml(alt.description || '')}</p>
        </div>
      </div>

      <div class="alt-comparison-grid">
        <div class="comparison-col col-packaged">
          <div class="col-header">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Why avoid ${escapeHtml(pkg.name)}?</span>
          </div>
          <ul>${packagedListItems || '<li style="color:var(--text-muted)">No data available</li>'}</ul>
        </div>

        <div class="comparison-col col-homemade">
          <div class="col-header">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
            <span>Benefits of going homemade</span>
          </div>
          <ul>${homemadeListItems || '<li style="color:var(--text-muted)">No data available</li>'}</ul>
        </div>
      </div>

      <div class="health-badge-wrap">
        <span class="health-badge ${healthBadgeClass}">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M9 12L11 14L15 10M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          ${escapeHtml(alt.healthLabel || 'Homemade — Much Healthier')}
        </span>
        <span class="health-compare-text">Make the switch today!</span>
      </div>

      ${recipeCardsHTML}

      <div class="alt-actions">
        <button type="button" class="btn-secondary" onclick="tryAgain()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M1 4V10H7M23 20V14H17M3.51 15C4.16 16.84 5.39 18.42 7.01 19.5C8.64 20.58 10.57 21.11 12.53 21C14.49 20.9 16.35 20.17 17.85 18.92C19.35 17.68 20.4 15.97 20.95 14M20.49 9C19.84 7.16 18.61 5.58 16.99 4.5C15.36 3.42 13.43 2.89 11.47 3C9.51 3.1 7.65 3.83 6.15 5.08C4.65 6.33 3.6 8.03 3.05 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Search Another Food</span>
        </button>
      </div>
    </div>
  `;

  document.getElementById('results-section').classList.remove('hidden');
  document.getElementById('results-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================
// Toggle Recipe Drawer
// ============================
function toggleRecipe(idx) {
  const drawer = document.getElementById(`recipe-drawer-${idx}`);
  const btn    = document.getElementById(`toggle-btn-${idx}`);
  const span   = btn.querySelector('span');
  const isOpen = !drawer.classList.contains('hidden');

  if (isOpen) {
    drawer.classList.add('hidden');
    btn.classList.remove('open');
    span.textContent = 'View Recipe';
  } else {
    drawer.classList.remove('hidden');
    btn.classList.add('open');
    span.textContent = 'Hide Recipe';
    drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// ============================
// Not Found / Try Again
// ============================
function showNotFound(query, message) {
  document.getElementById('notfound-text').textContent = message || `We couldn't find a match for "${query}". Try a different product name or check your spelling.`;
  document.getElementById('notfound-section').classList.remove('hidden');
  document.getElementById('notfound-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function tryAgain() {
  document.getElementById('results-section').classList.add('hidden');
  document.getElementById('notfound-section').classList.add('hidden');
  document.getElementById('loading-section').classList.add('hidden');
  document.getElementById('food-input').value = '';
  document.getElementById('food-input').focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function suggestClick(food) {
  document.getElementById('food-input').value = food;
  findAlternative();
}

// ============================
// Utility
// ============================
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================
// Event Listeners
// ============================
document.addEventListener('DOMContentLoaded', function () {
  const input = document.getElementById('food-input');

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); findAlternative(); }
  });

  console.log(`✅ Local database loaded: ${foodDatabase.length} foods available`);
});