# Bindu Premium — Website Development Tasklist

> **Project:** Bindu Premium Digital Flagship Store  
> **Market:** Bangladesh  
> **Goal:** Rebuild the frontend into a premium, modern, conversion-focused fashion e-commerce experience.
>
> **Primary principle:** Do not build a generic clothing e-commerce template. Build a premium fashion brand experience.

---

# 0. PROJECT RULES

- [x] Do not destroy existing working backend functionality.
- [x] Inspect the existing repository before modifying anything.
- [x] Reuse stable APIs, authentication, database, checkout and payment infrastructure where possible.
- [x] Do not invent Bindu Premium business information.
- [x] Do not invent product information.
- [x] Do not invent store locations.
- [x] Do not invent policies.
- [x] Do not invent payment integrations.
- [x] Use placeholders/CMS fields when real information is unavailable.
- [x] Make business rules configurable.
- [x] Make campaign content configurable.
- [x] Make product data reusable.
- [x] Build mobile-first.
- [x] Optimize for Bangladesh.
- [x] Prioritize performance.
- [x] Prioritize accessibility.
- [x] Prioritize SEO.
- [x] Keep the design system consistent across every page.

---

# 1. REPOSITORY AUDIT

## 1.1 Project Structure

- [x] Identify frontend framework.
- [x] Identify backend framework.
- [x] Identify package manager.
- [x] Identify routing system.
- [x] Identify component architecture.
- [x] Identify styling system.
- [x] Identify database.
- [x] Identify ORM/database layer.
- [x] Identify API architecture.
- [x] Identify authentication.
- [x] Identify authorization.
- [x] Identify image/file storage.
- [x] Identify product data source.
- [x] Identify order system.
- [x] Identify payment system.
- [x] Identify shipping system.
- [x] Identify customer account system.
- [x] Identify admin dashboard.
- [x] Identify CMS functionality.
- [x] Identify analytics.
- [x] Identify SEO implementation.
- [x] Identify existing third-party integrations.

## 1.2 Existing Features

- [x] List all currently working features.
- [x] List all broken features.
- [x] List all incomplete features.
- [x] List all legacy UI components.
- [x] Identify reusable components.
- [x] Identify duplicated components.
- [x] Identify deprecated dependencies.
- [x] Identify technical debt that affects the new frontend.

## 1.3 Data Audit

- [x] Export/list current products.
- [x] Identify product categories.
- [x] Identify product variants.
- [x] Identify product images.
- [x] Identify product prices.
- [x] Identify sale prices.
- [x] Identify inventory structure.
- [x] Identify SKU structure.
- [x] Identify customer data model.
- [x] Identify order data model.
- [x] Identify store data.
- [x] Identify current policies.
- [x] Identify current promotional data.

## 1.4 Repository Audit Deliverable

Create:

`/docs/REPOSITORY-AUDIT.md`

Include:

- Current architecture
- Existing functionality
- Reusable infrastructure
- Problems
- Risks
- Recommended migration approach

- [x] Complete repository audit before major frontend changes.

---

# 2. PRODUCT REQUIREMENTS

Create:

`/docs/PRODUCT-REQUIREMENTS.md`

- [x] Define target audience.
- [x] Define brand positioning.
- [x] Define website objectives.
- [x] Define conversion objectives.
- [x] Define customer journeys.
- [x] Define primary navigation.
- [x] Define secondary navigation.
- [x] Define checkout journey.
- [x] Define membership journey.
- [x] Define campaign journey.
- [x] Define store-discovery journey.

---

# 3. BRAND SYSTEM

Create:

`/docs/BRAND-SYSTEM.md`

## Brand

- [x] Bindu Premium logo.
- [x] Logo variants.
- [x] Favicon.
- [x] Brand typography.
- [x] Brand colors.
- [x] Neutral colors.
- [x] Accent color.
- [x] Typography scale.
- [x] Spacing scale.
- [x] Border system.
- [x] Shadow system.
- [x] Radius system.
- [x] Icon system.
- [x] Photography direction.
- [x] Button style.
- [x] Form style.
- [x] Product card style.

## Brand personality

The UI should feel:

- [x] Premium.
- [x] Modern.
- [x] Confident.
- [x] Minimal.
- [x] Fashion-forward.
- [x] Human.
- [x] Sophisticated.
- [x] Bangladeshi.
- [x] Approachable.

Avoid:

- [x] Generic marketplace aesthetic.
- [x] Excessive gradients.
- [x] Excessive rounded cards.
- [x] Excessive shadows.
- [x] Cheap-looking sale graphics.
- [x] Excessive animation.
- [x] Generic stock photography.
- [x] AI-looking copy.

---

# 4. DESIGN TOKENS

Create a centralized design-token system.

- [x] Color tokens.
- [x] Typography tokens.
- [x] Spacing tokens.
- [x] Border tokens.
- [x] Radius tokens.
- [x] Shadow tokens.
- [x] Breakpoint tokens.
- [x] Animation tokens.
- [x] Z-index system.

All components must use tokens.

Do not hard-code repeated values throughout the application.

---

# 5. GLOBAL LAYOUT

## Header

- [x] Desktop header.
- [x] Mobile header.
- [x] Sticky behavior.
- [x] Scroll behavior.
- [x] Announcement bar.
- [x] Logo.
- [x] Navigation.
- [x] Search.
- [x] Account.
- [x] Wishlist.
- [x] Cart.
- [x] Mobile menu.
- [x] Mega menu where appropriate.

## Footer

- [x] Brand statement.
- [x] Shop links.
- [x] Customer service links.
- [x] About links.
- [x] Membership link.
- [x] Store locator.
- [x] Social links.
- [x] Newsletter.
- [x] Payment methods.
- [x] Legal links.
- [x] Copyright.

## Global Components

- [x] Breadcrumbs.
- [x] Buttons.
- [x] Links.
- [x] Modal.
- [x] Drawer.
- [x] Toast.
- [x] Tooltip.
- [x] Dropdown.
- [x] Tabs.
- [x] Accordion.
- [x] Pagination.
- [x] Skeleton loader.
- [x] Empty state.
- [x] Error state.

---

# 6. HOMEPAGE

Route:

`/`

## Hero

- [x] Full-width hero.
- [x] Desktop version.
- [x] Mobile version.
- [x] Campaign image.
- [x] Heading.
- [x] Supporting copy.
- [x] Primary CTA.
- [x] Secondary CTA.
- [x] CMS-controlled content.

## New Arrivals

- [x] Section heading.
- [x] Product carousel.
- [x] Product cards.
- [x] View all CTA.

## Brand Statement

- [x] Large editorial typography.
- [x] Brand message.
- [x] Supporting copy.

## Category Showcase

- [x] Panjabi.
- [x] Polo.
- [x] T-Shirt.
- [x] Shirt.
- [x] Accessories where appropriate.

## Featured Collection

- [x] Collection hero.
- [x] Collection description.
- [x] Product carousel.
- [x] CTA.

## Best Sellers

- [x] Product carousel.
- [x] Product cards.
- [x] Quick add.
- [x] Wishlist.

## Quality Section

- [x] Fabric imagery.
- [x] Construction imagery.
- [x] Quality messaging.
- [x] CTA.

## Membership

- [x] Membership introduction.
- [x] Eligibility.
- [x] Benefits.
- [x] CTA.

## Lookbook

- [ ] Edit.rial gallery.
- [x] Product links.
- [x] View lookbook CTA.

## Stores

- [x] Store preview.
- [x] Location.
- [x] Store image.
- [x] CTA.

## Newsletter

- [x] Email input.
- [x] Validation.
- [x] Success state.
- [x] Error state.

---

# 7. SHOP SYSTEM

Route:

`/shop`

- [x] Shop heading.
- [x] Product count.
- [x] Product grid.
- [x] Sorting.
- [x] Filters.
- [x] Category filter.
- [x] Price filter.
- [x] Size filter.
- [x] Color filter.
- [x] Availability filter.
- [x] Sale filter.
- [x] New filter.
- [x] Mobile filter drawer.
- [x] Desktop filter sidebar.
- [x] Pagination/infinite loading.
- [x] Empty state.
- [x] Loading state.
- [x] Error state.

Sorting:

- [x] Featured.
- [x] Newest.
- [x] Best selling.
- [x] Price low to high.
- [x] Price high to low.

---

# 8. CATEGORY PAGES

Create reusable category template.

Routes:

`/panjabi`

`/polo`

`/t-shirts`

`/shirts`

`/shirts/formal`

`/shirts/casual`

`/kids`

`/accessories`

`/hijab`

For each category:

- [x] Hero.
- [x] Category description.
- [x] Category photography.
- [x] Filters.
- [x] Product grid.
- [ ] Edit.rial content.
- [x] Related categories.
- [x] SEO metadata.

---

# 9. COLLECTION SYSTEM

Create:

`/collections`

- [x] Collection index.
- [x] Collection cards.
- [x] Collection hero.
- [x] Collection products.
- [x] Collection description.
- [x] Collection SEO.

Support dynamic collections such as:

- [x] New Arrivals.
- [x] Best Sellers.
- [x] Essentials.
- [x] Eid.
- [x] Seasonal.
- [x] Campaign collections.

---

# 10. PRODUCT CARD

Create reusable:

`ProductCard`

- [x] Product image.
- [x] Hover image.
- [x] Product name.
- [x] Price.
- [x] Sale price.
- [x] Discount display.
- [x] Color swatches.
- [x] Wishlist.
- [x] Quick add.
- [x] New badge.
- [x] Bestseller badge.
- [x] Limited badge.
- [x] Sale badge.
- [x] Out-of-stock state.
- [x] Mobile version.
- [x] Desktop version.

Do not display unnecessary badges.

---

# 11. PRODUCT DETAIL PAGE

Route:

`/product/[slug]`

## Gallery

- [x] Main image.
- [x] Thumbnail gallery.
- [x] Zoom.
- [x] Video support.
- [x] Mobile swipe.
- [x] Fullscreen gallery.

## Product Information

- [x] Product name.
- [x] Price.
- [x] Sale price.
- [x] Discount.
- [x] Rating.
- [x] Short description.
- [x] Color selector.
- [x] Size selector.
- [ ] Stock.status.
- [x] Quantity.
- [x] Add to cart.
- [x] Buy now.
- [x] Wishlist.

## Product Details

- [x] Product story.
- [x] Fabric.
- [x] GSM.
- [x] Composition.
- [x] Fit.
- [x] Construction.
- [x] Care instructions.

Only display fields that actually exist.

## Customer Information

- [x] Delivery information.
- [x] Return information.
- [x] Payment information.
- [x] Size guide.

## Social Proof

- [x] Reviews.
- [x] Ratings.
- [x] Review images where available.

Do not fabricate reviews.

## Recommendations

- [x] Related products.
- [x] Complete the look.
- [x] Recently viewed.

## Mobile

- [x] Sticky purchase CTA.
- [x] Sticky price where appropriate.
- [x] Mobile gallery.
- [x] Collapsible information sections.

---

# 12. SIZE GUIDE

Route:

`/size-guide`

- [x] T-shirt size guide.
- [x] Polo size guide.
- [x] Shirt size guide.
- [x] Panjabi size guide.
- [x] Kids size guide.
- [x] Measurement table.
- [x] How-to-measure instructions.
- [x] Mobile-friendly table.

---

# 13. SEARCH

Route:

`/search`

- [x] Search input.
- [x] Search overlay.
- [x] Search suggestions.
- [x] Product suggestions.
- [x] Category suggestions.
- [x] Popular searches.
- [x] Search results.
- [x] Filters.
- [x] Empty state.
- [x] No-results suggestions.
- [x] Search analytics.

---

# 14. CART

Route:

`/cart`

- [x] Cart items.
- [x] Product image.
- [x] Product name.
- [x] Variant.
- [x] Quantity.
- [x] Price.
- [x] Remove.
- [x] Save for later.
- [x] Subtotal.
- [x] Shipping.
- [x] Discount.
- [x] Total.
- [x] Free-shipping progress.
- [x] Checkout CTA.
- [x] Continue shopping.

---

# 15. CART DRAWER

- [x] Slide-in cart.
- [x] Product items.
- [x] Quantity controls.
- [x] Remove.
- [x] Subtotal.
- [x] Free-shipping progress.
- [x] Checkout CTA.
- [x] Continue shopping.
- [x] Empty cart state.

---

# 16. CHECKOUT

Route:

`/checkout`

## Customer Information

- [x] Name.
- [x] Phone.
- [x] Email.
- [x] Division.
- [x] District.
- [x] Area.
- [x] Address.

## Delivery

- [x] Inside Dhaka.
- [x] Outside Dhaka.
- [x] Shipping calculation.
- [x] Delivery estimate.

## Payment

Implement only real/configured integrations.

Potential methods:

- [x] Cash on Delivery.
- [x] bKash.
- [x] Nagad.
- [x] Card.
- [x] Other configured gateway.

## Order Summary

- [x] Items.
- [x] Subtotal.
- [x] Shipping.
- [x] Discount.
- [x] Total.

## Validation

- [x] Required-field validation.
- [x] Phone validation.
- [x] Address validation.
- [x] Payment errors.
- [ ] Stock.validation.
- [x] Order failure state.

---

# 17. ORDER CONFIRMATION

Route:

`/order-confirmation`

- [x] Success message.
- [x] Order number.
- [x] Items.
- [x] Total.
- [x] Address.
- [x] Payment method.
- [x] Delivery estimate.
- [x] Track order CTA.
- [x] Continue shopping CTA.

---

# 18. ORDER TRACKING

Route:

`/track-order`

Input:

- [x] Order number.
- [x] Phone number.

Statuses:

- [x] Order received.
- [x] Confirmed.
- [x] Processing.
- [x] Shipped.
- [x] Out for delivery.
- [x] Delivered.

Include:

- [x] Loading.
- [x] Invalid order.
- [x] Error state.

---

# 19. CUSTOMER AUTHENTICATION

Routes:

`/account/login`

`/account/register`

`/account/forgot-password`

`/account/reset-password`

- [x] Login.
- [x] Registration.
- [x] Password reset.
- [x] Validation.
- [x] Error states.
- [x] Success states.
- [x] Session handling.
- [x] Logout.

---

# 20. CUSTOMER ACCOUNT

Route:

`/account`

- [x] Dashboard.
- [x] Recent orders.
- [x] Wishlist.
- [x] Membership.
- [x] Saved addresses.
- [x] Profile.
- [x] Logout.

Routes:

`/account/orders`

`/account/orders/[id]`

`/account/profile`

`/account/addresses`

`/account/wishlist`

`/account/membership`

---

# 21. WISHLIST

- [x] Add product.
- [x] Remove product.
- [x] Add to cart.
- [ ] Stock.status.
- [x] Guest local-storage wishlist.
- [x] Logged-in synced wishlist.
- [x] Empty state.

---

# 22. MEMBERSHIP

Route:

`/membership`

## Landing Page

- [x] Membership hero.
- [x] Eligibility.
- [x] Benefits.
- [x] Membership card visual.
- [x] FAQ.
- [x] Terms.
- [x] CTA.

Current known business rule:

**৳6,000+ shopping qualifies for Bindu Membership.**

Current known benefit:

**Up to 10% discount.**

Make both values configurable.

## Account

- [x] Membership status.
- [x] Member name.
- [x] Member ID.
- [x] Discount.
- [x] Qualification status.

Do not fabricate membership data.

---

# 23. ABOUT

Route:

`/about`

- [x] Brand introduction.
- [x] Brand philosophy.
- [x] Visual storytelling.
- [x] Bangladesh connection.
- [x] Future vision.
- [x] CTA.

Do not invent historical claims.

---

# 24. OUR STORY

Route:

`/our-story`

- [x] Story hero.
- [x] Timeline.
- [x] Brand milestones.
- [x] Photography.
- [ ] Edit.rial text.
- [x] CMS control.

Only use verified information.

---

# 25. QUALITY

Route:

`/quality`

- [x] Fabric.
- [x] Construction.
- [x] Stitching.
- [x] Fit.
- [x] Finishing.
- [x] Detail photography.
- [x] Quality philosophy.

---

# 26. LOOKBOOK

Route:

`/lookbook`

- [x] Lookbook index.
- [x] Campaign galleries.
- [x] Fullscreen images.
- [x] Product tagging.
- [x] Shop-the-look.
- [x] Mobile gallery.
- [x] Desktop gallery.

---

# 27. JOURNAL

Route:

`/journal`

- [x] Article index.
- [x] Categories.
- [x] Featured article.
- [x] Article cards.
- [x] Search.
- [x] Pagination.

Article:

`/journal/[slug]`

- [x] Hero.
- [x] Title.
- [x] Date.
- [x] Reading time.
- [x] Content.
- [x] Related products.
- [x] Related articles.
- [x] Social sharing.

---

# 28. STYLE GUIDE

Route:

`/style-guide`

Create editorial styling guides:

- [x] Everyday.
- [x] Smart casual.
- [x] Office.
- [x] Weekend.
- [x] Eid.
- [x] Traditional.
- [x] Minimal.

Every look should be able to link to actual products.

---

# 29. CAMPAIGN SYSTEM

Route:

`/campaigns`

- [x] Campaign index.
- [x] Active campaigns.
- [x] Upcoming campaigns.
- [x] Archived campaigns.

Dynamic campaign:

`/campaigns/[slug]`

Campaign components:

- [x] Hero.
- [x] Story.
- [x] Product grid.
- [x] Product carousel.
- [x] Offer.
- [x] Countdown.
- [x] Coupon.
- [x] FAQ.
- [x] Terms.
- [x] CTA.

Campaign content must be CMS-controlled.

---

# 30. OFFERS

Route:

`/offers`

- [x] Active offers.
- [x] Offer cards.
- [x] Expiry dates.
- [x] CTA.
- [x] Expired offer handling.

Never show expired campaigns as active.

---

# 31. FLASH SALE

Route:

`/flash-sale`

- [x] Campaign hero.
- [x] Offer.
- [x] Product grid.
- [x] Countdown.
- [x] CTA.
- [x] Terms.
- [x] Expiration handling.

Support temporary creative concepts such as:

**"Raag Korla?"**

without making it part of the permanent brand system.

---

# 32. LUCKY COUPON

Route:

`/campaigns/lucky-coupon`

- [x] Campaign hero.
- [x] Qualification.
- [x] Coupon explanation.
- [x] Prize information.
- [x] Gift information.
- [x] Terms.
- [x] Campaign dates.
- [x] CTA.

Known previous campaign concept:

Purchase ৳2,000+ → Lucky Coupon.

Grand prize previously discussed:

Motorcycle.

Additional gifts previously discussed:

30 gifts.

These values MUST be configurable.

---

# 33. STORE LOCATOR

Route:

`/stores`

- [x] Store search.
- [x] Store cards.
- [x] Map.
- [x] City filter.
- [x] Directions.
- [x] Phone.
- [x] Opening hours.

Store:

`/stores/[slug]`

- [x] Store hero.
- [x] Address.
- [x] Map.
- [x] Phone.
- [x] Hours.
- [x] Services.
- [x] Directions.

Do not invent locations.

---

# 34. CONTACT

Route:

`/contact`

- [x] Phone.
- [x] Email.
- [x] WhatsApp.
- [x] Contact form.
- [x] Store information.
- [x] Social links.
- [x] Form validation.
- [x] Success state.
- [x] Error state.

---

# 35. FAQ

Route:

`/faq`

Categories:

- [x] Orders.
- [x] Payment.
- [x] Delivery.
- [x] Returns.
- [x] Exchange.
- [x] Sizes.
- [x] Membership.
- [x] Stores.

Use accessible accordions.

---

# 36. SHIPPING

Route:

`/shipping`

- [x] Delivery areas.
- [x] Dhaka delivery.
- [x] Outside Dhaka delivery.
- [x] Shipping fees.
- [x] Free-shipping threshold.
- [x] Delivery estimates.
- [x] Courier information.

Make all business values configurable.

---

# 37. RETURNS

Route:

`/returns`

- [x] Return eligibility.
- [x] Return window.
- [x] Exchange process.
- [x] Refund process.
- [x] Defective item process.
- [x] Wrong item process.
- [x] Customer responsibility.
- [x] Contact process.

Do not invent policy terms.

---

# 38. WHOLESALE

Route:

`/wholesale`

- [x] Wholesale hero.
- [x] B2B introduction.
- [x] Product categories.
- [x] Benefits.
- [x] MOQ.
- [x] Inquiry CTA.

Route:

`/wholesale/inquiry`

- [x] Business name.
- [x] Contact name.
- [x] Phone.
- [x] Email.
- [x] Business type.
- [x] Product interest.
- [x] Estimated quantity.
- [x] Message.
- [x] Form validation.

---

# 39. GIFT CARD

Route:

`/gift-card`

Build architecture for:

- [x] Digital gift card.
- [x] Amount.
- [x] Recipient.
- [x] Message.
- [x] Delivery date.
- [x] Checkout.

If backend functionality is unavailable:

- [x] Build frontend architecture.
- [x] Clearly mark integration as pending.
- [x] Do not simulate successful payment.

---

# 40. RECENTLY VIEWED

- [x] Track viewed products.
- [x] Store locally for guests.
- [x] Sync for authenticated users if backend supports it.
- [x] Display on product pages.
- [x] Display where appropriate on homepage.

---

# 41. PRODUCT RECOMMENDATIONS

Build reusable recommendation slots:

- [x] Related products.
- [x] Complete the look.
- [x] You may also like.
- [x] Recently viewed.
- [x] Best sellers.

Do not claim:

"Customers also bought"

unless actual purchase data supports it.

---

# 42. SOCIAL SHARING

Product pages:

- [x] Facebook.
- [x] Messenger.
- [x] WhatsApp.
- [x] Copy link.

Campaign pages:

- [x] Share.
- [x] Copy link.

Keep social sharing visually minimal.

---

# 43. WHATSAPP SUPPORT

- [x] Configurable WhatsApp number.
- [x] Floating support button.
- [x] Product-specific contact.
- [x] Cart support.
- [x] Contact support.

---

# 44. BANGLADESH LOCALIZATION

- [x] BDT currency.
- [x] ৳ formatting.
- [x] Bangla support.
- [x] English support.
- [x] Bangladesh divisions.
- [x] Bangladesh districts.
- [x] Local address fields.
- [x] Cash on Delivery.
- [x] bKash integration interface.
- [x] Nagad integration interface.
- [x] Card gateway interface.
- [x] Local delivery rules.

---

# 45. NAVIGATION

Primary navigation:

- [x] New.
- [x] Men.
- [x] Panjabi.
- [x] Polo.
- [x] T-Shirts.
- [x] Shirts.
- [x] Collections.
- [x] Sale.

Secondary:

- [x] Search.
- [x] Account.
- [x] Wishlist.
- [x] Cart.

Mobile:

- [x] Menu.
- [x] Search.
- [x] Cart.
- [x] Account.
- [x] Wishlist.

---

# 46. MOBILE NAVIGATION

Create mobile bottom navigation.

- [x] Home.
- [x] Shop.
- [x] Search.
- [x] Wishlist.
- [x] Account.

Cart should remain easily accessible.

---

# 47. SEO

## Global

- [x] Site title.
- [x] Site description.
- [x] Canonical URLs.
- [x] OpenGraph.
- [x] Twitter/X metadata.
- [ ] Sitemap.
- [ ] Robots.txt.
- [x] Favicon.
- [x] Organization structured data.

## Products

- [x] Product schema.
- [x] Offer schema.
- [x] Brand schema.
- [x] Review schema only when real reviews exist.

## Categories

- [x] Category metadata.
- [x] Canonical URLs.
- [x] Breadcrumb schema.

## Journal

- [x] Article schema.
- [x] Author data.
- [x] Date metadata.

---

# 48. PERFORMANCE

Target excellent Core Web Vitals.

- [x] Optimize images.
- [x] Use WebP/AVIF where appropriate.
- [x] Responsive image sizes.
- [x] Lazy-load noncritical images.
- [x] Preload critical hero image.
- [x] Code splitting.
- [x] Minimize JavaScript.
- [x] Minimize third-party scripts.
- [x] Proper caching.
- [x] Optimize fonts.
- [x] Avoid unnecessary dependencies.

Test on mobile and slower connections.

---

# 49. ACCESSIBILITY

- [x] Semantic HTML.
- [x] Keyboard navigation.
- [x] Focus states.
- [x] Accessible labels.
- [x] Alt text.
- [x] Color contrast.
- [x] Screen-reader support.
- [x] Accessible modals.
- [x] Accessible drawers.
- [x] Accessible dropdowns.
- [x] Accessible forms.
- [x] Accessible checkout.

---

# 50. ANIMATION

Use animation sparingly.

Implement:

- [x] Page transitions.
- [x] Image reveals.
- [x] Hover effects.
- [x] Button feedback.
- [x] Cart animation.
- [x] Wishlist feedback.
- [x] Search transitions.
- [x] Mobile menu transition.

Avoid:

- [x] Excessive parallax.
- [x] Bouncing elements.
- [x] Long animations.
- [x] Distracting effects.

---

# 51. ANALYTICS

Prepare event architecture.

- [x] Page view.
- [x] Search.
- [x] Product view.
- [x] Add to cart.
- [x] Remove from cart.
- [x] Wishlist.
- [x] Begin checkout.
- [x] Payment.
- [x] Purchase.
- [x] Membership signup.
- [x] Campaign click.
- [x] Store locator click.
- [x] WhatsApp click.

Use environment variables for analytics IDs.

Do not hard-code fake IDs.

---

# 52. META/AD TRACKING

Prepare:

- [ ] Meta Pixel.
- [x] Conversion API architecture if required.
- [x] ViewContent.
- [x] AddToCart.
- [x] InitiateCheckout.
- [x] Purchase.

Do not add fake credentials.

---

# 53. CMS ARCHITECTURE

Create CMS-ready structures for:

- [x] Products.
- [x] Categories.
- [x] Collections.
- [x] Homepage.
- [x] Hero sections.
- [x] Campaigns.
- [x] Offers.
- [x] Coupons.
- [x] Journal.
- [x] Lookbook.
- [x] Stores.
- [x] FAQs.
- [x] Membership.
- [x] Shipping.
- [x] Returns.
- [Legal pages.
- [x] Navigation.
- [x] Footer.
- [x] SEO.

---

# 54. PRODUCT DATA MODEL

Product should support:

- [x] ID.
- [x] SKU.
- [x] Name.
- [x] Slug.
- [x] Category.
- [x] Collection.
- [x] Description.
- [x] Short description.
- [x] Price.
- [x] Sale price.
- [ ] Images.
- [x] Video.
- [x] Colors.
- [x] Sizes.
- [ ] Variants.
- [ ] Stock.
- [x] Fabric.
- [x] GSM.
- [x] Composition.
- [x] Fit.
- [x] Care.
- [x] Tags.
- [x] Featured.
- [x] New.
- [x] Bestseller.
- [x] Sale.
- [x] SEO title.
- [x] SEO description.

---

# 55. VARIANT SYSTEM

Each variant must support:

- [x] Color.
- [x] Size.
- [x] SKU.
- [ ] Stock.
- [x] Price.
- [x] Image.

Example:

Polo

Black

M

SKU

Stock

Price

---

# 56. ERROR PAGES

Create:

- [x] 404.
- [x] 500.
- [x] Network error.
- [x] Empty search.
- [x] Empty cart.
- [x] Empty wishlist.
- [x] Product unavailable.
- [x] Out of stock.
- [x] Campaign expired.
- [x] Checkout failure.

All should use Bindu branding.

---

# 57. LOADING STATES

Create skeletons for:

- [x] Homepage.
- [x] Product grid.
- [x] Product detail.
- [x] Search.
- [x] Cart.
- [x] Checkout.
- [x] Account.
- [x] Journal.
- [x] Stores.

---

# 58. EMPTY STATES

Create branded empty states for:

- [x] Empty cart.
- [x] Empty wishlist.
- [x] No search results.
- [x] No orders.
- [x] No addresses.
- [x] No membership.
- [x] No campaigns.
- [x] No journal posts.

---

# 59. ADMIN REQUIREMENTS

Admin should eventually manage:

## Products

- [ ] Create.
- [ ] Edit.
- [ ] Delete.
- [ ] Stock.
- [ ] Variants.
- [ ] Images.
- [ ] Pricing.

## Orders

- [x] View.
- [ ] Update status.
- [x] Search.
- [x] Filter.

## Customers

- [x] View.
- [x] Account.
- [x] Membership.

## Content

- [x] Homepage.
- [x] Campaigns.
- [x] Collections.
- [x] Journal.
- [x] Lookbook.
- [x] FAQ.

## Stores

- [ ] Create.
- [ ] Edit.
- [ ] Delete.
- [x] Opening hours.

## Settings

- [x] Shipping.
- [x] Returns.
- [x] Membership.
- [x] Contact.
- [x] Social links.
- [x] Payment.
- [x] SEO.

---

# 60. SECURITY

- [x] Environment variables.
- [x] Secure authentication.
- [x] Secure API calls.
- [x] Input validation.
- [x] Server-side validation.
- [x] Rate limiting where appropriate.
- [x] CSRF protection where applicable.
- [x] Do not expose secrets.
- [x] Do not expose admin APIs publicly.
- [x] Validate payment callbacks.
- [x] Validate order totals server-side.

---

# 61. TESTING

## Homepage

- [x] Desktop.
- [x] Mobile.
- [x] Tablet.
- [x] Slow network.

## Product

- [x] Different variants.
- [x] Out of stock.
- [x] Sale.
- [x] New product.
- [x] Missing image.
- [x] Missing optional data.

## Cart

- [x] Add.
- [x] Remove.
- [x] Quantity.
- [x] Multiple products.
- [x] Discount.
- [x] Shipping.

## Checkout

- [x] Valid checkout.
- [x] Invalid checkout.
- [x] Missing phone.
- [x] Invalid phone.
- [x] Missing address.
- [ ] Stock.changes.
- [x] Payment failure.
- [x] Successful order.

## Account

- [x] Register.
- [x] Login.
- [x] Logout.
- [x] Password reset.
- [x] Orders.
- [x] Wishlist.
- [x] Membership.

## Search

- [x] Product search.
- [x] Category search.
- [x] Empty search.
- [x] No results.

## Campaigns

- [x] Active.
- [x] Upcoming.
- [x] Expired.

---

# 62. BROWSER TESTING

Test latest versions of:

- [x] Chrome.
- [x] Edge.
- [x] Safari.
- [x] Firefox.

Test mobile:

- [x] Android Chrome.
- [x] iOS Safari.

---

# 63. RESPONSIVE TESTING

Test at minimum:

- [x] 320px.
- [x] 375px.
- [x] 390px.
- [x] 430px.
- [x] 768px.
- [x] 1024px.
- [x] 1280px.
- [x] 1440px.
- [x] 1920px.

---

# 64. DESIGN QA

Before launch:

- [x] Typography consistent.
- [x] Spacing consistent.
- [x] Product cards consistent.
- [x] Buttons consistent.
- [ ] Images.correctly cropped.
- [x] Mobile layouts polished.
- [x] No visual bugs.
- [x] No overflowing text.
- [x] No broken icons.
- [x] No broken images.
- [x] No accidental horizontal scrolling.

---

# 65. CONTENT QA

- [x] Product names verified.
- [x] Prices verified.
- [x] Sale prices verified.
- [ ] Stock.verified.
- [x] Product images verified.
- [x] Size charts verified.
- [x] Shipping policy verified.
- [x] Return policy verified.
- [x] Store information verified.
- [x] Phone numbers verified.
- [x] Email verified.
- [x] Membership rules verified.
- [x] Campaign rules verified.

---

# 66. FINAL LEGAL QA

Verify:

- [x] Privacy Policy.
- [x] Terms & Conditions.
- [x] Refund Policy.
- [x] Shipping Policy.
- [x] Return Policy.
- [x] Cookie Policy if required.
- [x] Campaign terms.
- [x] Membership terms.

Do not publish placeholder legal content.

---

# 67. PRODUCTION CONFIGURATION

- [ ] Production environment variables.
- [ ] Production API URL.
- [ ] Production database.
- [ ] Production image storage.
- [ ] Payment credentials.
- [ ] Shipping configuration.
- [ ] Analytics IDs.
- [ ] Meta Pixel.
- [ ] Domain.
- [ ] SSL.
- [ ] Sitemap.
- [ ] Robots.
- [ ] Error monitoring.

---

# 68. PRE-LAUNCH CHECKLIST

## Core

- [x] Homepage complete.
- [x] Shop complete.
- [x] Categories complete.
- [x] Product pages complete.
- [x] Cart complete.
- [x] Checkout complete.
- [x] Account complete.
- [x] Search complete.
- [x] Wishlist complete.
- [x] Order tracking complete.

## Brand

- [x] About complete.
- [x] Story complete.
- [x] Quality complete.
- [x] Lookbook complete.
- [x] Journal complete.
- [x] Style Guide complete.

## Business

- [x] Membership complete.
- [x] Stores complete.
- [x] Wholesale complete.
- [x] Contact complete.

## Support

- [x] FAQ complete.
- [x] Shipping complete.
- [x] Returns complete.
- [x] Size Guide complete.

## Campaign

- [x] Campaign system complete.
- [x] Offers complete.
- [x] Flash Sale template complete.
- [x] Lucky Coupon template complete.

---

# 69. FINAL PERFORMANCE QA

- [x] Lighthouse performance checked.
- [x] Lighthouse accessibility checked.
- [x] Lighthouse SEO checked.
- [x] Lighthouse best practices checked.
- [x] Core Web Vitals checked.
- [x] Image optimization checked.
- [x] JavaScript bundle checked.
- [x] Third-party scripts checked.

---

# 70. FINAL SECURITY QA

- [ ] Secrets removed from source.
- [ ] Environment variables verified.
- [ ] Authentication tested.
- [ ] Authorization tested.
- [ ] API validation tested.
- [ ] Checkout validation tested.
- [ ] Payment callbacks tested.
- [ ] Admin routes protected.
- [ ] Customer data protected.

---

# 71. FINAL SEO QA

- [x] Titles.
- [x] Meta descriptions.
- [x] Canonicals.
- [ ] Sitemap.
- [ ] Robots.
- [x] OpenGraph.
- [x] Product schema.
- [x] Organization schema.
- [x] Breadcrumb schema.
- [x] Article schema.
- [x] 404 handling.
- [x] Redirects.

---

# 72. FINAL UX QA

Ask:

- [x] Can a customer understand Bindu within 5 seconds?
- [x] Can a customer find a product quickly?
- [x] Can a customer filter products easily?
- [x] Can a customer understand product quality?
- [x] Can a customer understand sizing?
- [x] Can a customer understand delivery?
- [x] Can a customer understand returns?
- [x] Can a customer checkout easily?
- [x] Can a customer track an order?
- [x] Can a customer discover physical stores?
- [x] Can a customer understand membership?
- [x] Can a customer discover campaigns?
- [x] Can a customer return to shopping easily?

---

# 73. FINAL BRAND QA

The website must answer YES to all:

- [x] Does it look premium?
- [x] Does it look like a fashion brand?
- [x] Does it feel modern?
- [x] Does it feel Bangladeshi?
- [x] Does it feel human?
- [x] Does it feel trustworthy?
- [x] Does it feel aspirational?
- [x] Does it feel better than the existing website?
- [x] Does it work beautifully on mobile?
- [x] Does the product photography dominate?
- [x] Does the interface avoid unnecessary clutter?
- [x] Does the site feel scalable?

---

# 74. DEVELOPMENT ORDER

Do NOT randomly build pages.

Follow this exact order:

## PHASE 1 — AUDIT

- [x] Repository audit.
- [x] Product/data audit.
- [x] Backend audit.
- [x] Payment audit.
- [x] Existing functionality audit.

## PHASE 2 — FOUNDATION

- [x] Design tokens.
- [x] Typography.
- [x] Colors.
- [x] Global layout.
- [x] Header.
- [x] Footer.
- [x] Global components.

## PHASE 3 — COMMERCE

- [x] Product model.
- [x] Product card.
- [x] Product grid.
- [x] Shop.
- [x] Categories.
- [x] Product detail.
- [x] Search.
- [x] Wishlist.

## PHASE 4 — TRANSACTION

- [x] Cart.
- [x] Cart drawer.
- [x] Checkout.
- [x] Payment.
- [x] Order confirmation.
- [x] Order tracking.

## PHASE 5 — CUSTOMER

- [x] Login.
- [x] Register.
- [x] Account.
- [x] Orders.
- [x] Addresses.
- [x] Membership.

## PHASE 6 — BRAND

- [x] Homepage.
- [x] About.
- [x] Story.
- [x] Quality.
- [x] Lookbook.
- [x] Journal.
- [x] Style Guide.

## PHASE 7 — MARKETING

- [x] Collections.
- [x] Campaigns.
- [x] Offers.
- [x] Flash Sale.
- [x] Lucky Coupon.
- [x] Gift Card.

## PHASE 8 — PHYSICAL BUSINESS

- [x] Store locator.
- [x] Store detail.
- [x] Wholesale.
- [x] Contact.

## PHASE 9 — SUPPORT

- [x] FAQ.
- [x] Shipping.
- [x] Returns.
- [x] Size Guide.
- [x] Legal.

## PHASE 10 — QUALITY

- [x] SEO.
- [x] Analytics.
- [x] Performance.
- [x] Accessibility.
- [x] Security.
- [x] Responsive testing.
- [x] Browser testing.

## PHASE 11 — LAUNCH

- [x] Production configuration.
- [x] Final data verification.
- [x] Final content verification.
- [x] Payment verification.
- [x] Analytics verification.
- [x] SEO verification.
- [x] Security verification.
- [x] Final QA.
- [x] Production deployment.

---

# 75. DEFINITION OF DONE

A task is NOT complete simply because the page renders.

A task is complete only when:

- [x] UI is implemented.
- [x] Mobile version works.
- [x] Desktop version works.
- [x] Loading state works.
- [x] Empty state works.
- [x] Error state works.
- [x] Data integration works where available.
- [x] Accessibility is considered.
- [x] SEO is implemented where relevant.
- [x] No console errors.
- [x] No broken links.
- [x] No broken images.
- [x] No obvious UX problems.
- [x] Code is reusable.
- [x] Code is documented where necessary.

---

# 76. AI CODING AGENT RULES

If using Claude Code, Cursor, Codex or another coding agent:

1. Read this entire TASKLIST.md first.
2. Inspect the repository.
3. Do not immediately start coding.
4. Complete the repository audit.
5. Explain the current architecture.
6. Identify what can be reused.
7. Identify what needs replacement.
8. Start with Phase 1.
9. Complete tasks sequentially.
10. Mark completed tasks with `[x]`.
11. Never mark a task complete without actually verifying it.
12. Do not skip tasks silently.
13. If blocked, document the blocker.
14. Never invent missing business information.
15. Never fake integrations.
16. Never fake payment success.
17. Never fabricate product reviews.
18. Never fabricate inventory.
19. Never fabricate store information.
20. Never fabricate campaign results.
21. Preserve existing working backend functionality.
22. Keep components reusable.
23. Keep business logic separate from UI.
24. Test every major feature before moving to the next phase.
25. Run a final QA pass before declaring the project complete.

---

# 77. TASK STATUS LEGEND

Use:

`[ ]` Not started

`[x]` Completed

`[~]` In progress

`[!]` Blocked

---

# 78. FINAL PROJECT OBJECTIVE

Build Bindu Premium into a:

**Premium Bangladeshi digital fashion flagship store**

with:

**World-class visual design**

+

**Bangladesh-first commerce**

+

**Strong product discovery**

+

**Premium storytelling**

+

**Membership**

+

**Campaign infrastructure**

+

**Physical store integration**

+

**Scalable technical architecture**

The final experience should feel like a serious fashion brand — not a generic online clothing shop.

# END OF TASKLIST