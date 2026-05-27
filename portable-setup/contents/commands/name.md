# Name My Product

<command_meta>
  <name>name</name>
  <description>Generate and validate product names with domain checking, competitor scanning, and scoring. Use when naming a new product, renaming to avoid conflicts, or evaluating name candidates.</description>
</command_meta>

Use the `product-naming` skill to run the full naming process.

**Input:** $ARGUMENTS

If no arguments provided, ask the user:
1. What does the product do? (one sentence)
2. Who is it for?
3. What feeling should the name evoke?
4. Any constraints? (length, domain TLD, etc.)

Then follow the skill's 6-phase process: Brief > Generate > First Cut > Validate > Score > Recommend.

**Critical rule:** Never present a name to the user without running all 5 validation checks first (web search, domain probe, Product Hunt, social handles, negative connotations).
