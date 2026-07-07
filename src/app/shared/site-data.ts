export type CategorySlug = 'mobiles' | 'tablets' | 'laptops' | 'mac' | 'watch' | 'bike';

export interface CategoryItem {
    slug: CategorySlug;
    label: string;
    icon: string;
    accent: string;
    description: string;
}

export interface BrandItem {
    slug: string;
    name: string;
    tint: string;
}

export interface VariantItem {
    slug: string;
    label: string;
    basePrice: number;
}

export interface DeviceModel {
    slug: string;
    name: string;
    summary: string;
    basePrice: number;
    accent: string;
    badge: string;
    imageLabel: string;
    variants: VariantItem[];
}

export interface CategoryBrands {
    [brandSlug: string]: DeviceModel[];
}

export interface StaticPageContent {
    title: string;
    eyebrow: string;
    hero: string;
    body: string[];
    bullets?: string[];
}

const variantSet = (base: number, step = 1200): VariantItem[] => [
    { slug: '64gb', label: '64 GB', basePrice: base },
    { slug: '128gb', label: '128 GB', basePrice: base + step },
    { slug: '256gb', label: '256 GB', basePrice: base + step * 2 },
];

const makeModel = (
    slug: string,
    name: string,
    summary: string,
    basePrice: number,
    accent: string,
    badge: string,
    imageLabel: string,
    step = 1200,
): DeviceModel => ({
    slug,
    name,
    summary,
    basePrice,
    accent,
    badge,
    imageLabel,
    variants: variantSet(basePrice, step),
});

export const categories: CategoryItem[] = [
    { slug: 'mobiles', label: 'Mobiles', icon: 'phone-portrait-outline', accent: '#7c8cff', description: 'Latest phones and trusted classics.' },
    { slug: 'tablets', label: 'Tablets', icon: 'tablet-portrait-outline', accent: '#2fe0c0', description: 'iPads and Android tablets.' },
    { slug: 'laptops', label: 'Laptops', icon: 'laptop-outline', accent: '#ff8a7a', description: 'Windows and creator laptops.' },
    { slug: 'mac', label: 'Mac', icon: 'desktop-outline', accent: '#a88cff', description: 'MacBook Air and Pro devices.' },
    { slug: 'watch', label: 'Watch', icon: 'watch-outline', accent: '#7ef0a9', description: 'Smartwatches with style.' },
    { slug: 'bike', label: 'Bike', icon: 'bicycle-outline', accent: '#ffd166', description: 'Two-wheelers with instant valuation.' },
];

export const featuredBrands: BrandItem[] = [
    { slug: 'apple', name: 'Apple', tint: '#7c8cff' },
    { slug: 'samsung', name: 'Samsung', tint: '#2fe0c0' },
    { slug: 'oneplus', name: 'OnePlus', tint: '#ff8a7a' },
    { slug: 'vivo', name: 'Vivo', tint: '#8be1ff' },
    { slug: 'oppo', name: 'OPPO', tint: '#91f0ad' },
    { slug: 'xiaomi', name: 'Xiaomi', tint: '#ffd166' },
    { slug: 'realme', name: 'realme', tint: '#b59cff' },
    { slug: 'lenovo', name: 'Lenovo', tint: '#f29cc7' },
    { slug: 'hp', name: 'HP', tint: '#5fd3ff' },
    { slug: 'hero', name: 'Hero', tint: '#ffb86b' },
    { slug: 'tvs', name: 'TVS', tint: '#61d6ce' },
    { slug: 'suzuki', name: 'Suzuki', tint: '#ff9d96' },
];

export const catalog: Record<CategorySlug, CategoryBrands> = {
    mobiles: {
        apple: [
            makeModel('iphone-15-pro', 'iPhone 15 Pro', 'Titanium build, A17 Pro, and premium resale demand.', 78200, '#7c8cff', 'Top pick', 'IP15'),
            makeModel('iphone-14', 'iPhone 14', 'Balanced value with strong resale performance.', 61200, '#8f9cff', 'Most traded', 'IP14'),
            makeModel('iphone-13', 'iPhone 13', 'Still a favourite for buyers and sellers alike.', 51200, '#9ba8ff', 'Reliable', 'IP13'),
        ],
        samsung: [
            makeModel('galaxy-s24', 'Galaxy S24', 'Flagship Android resale with premium demand.', 65200, '#2fe0c0', 'Hot', 'S24'),
            makeModel('galaxy-s23', 'Galaxy S23', 'Sleek, fast and easy to resell.', 52200, '#42e4c9', 'Popular', 'S23'),
            makeModel('galaxy-a55', 'Galaxy A55', 'Mid-range winner with broad audience appeal.', 31200, '#55ead0', 'Value', 'A55'),
        ],
        oneplus: [
            makeModel('oneplus-12r', 'OnePlus 12R', 'Speed-first performance with clean resale stats.', 42200, '#ff8a7a', 'Speed', '12R'),
            makeModel('oneplus-11', 'OnePlus 11', 'Premium feel with a strong collector base.', 38200, '#ff9c8f', 'Premium', '11'),
            makeModel('nord-ce4', 'Nord CE 4', 'Affordable and stylish, easy to move.', 24200, '#ffb0a8', 'Budget', 'CE4'),
        ],
    },
    tablets: {
        apple: [
            makeModel('ipad-air-5', 'iPad Air 5', 'Creator-friendly tablet with strong demand.', 45200, '#a88cff', 'Creative', 'Air 5'),
            makeModel('ipad-10', 'iPad 10th Gen', 'Daily-use tablet with wide buyer interest.', 32200, '#b59cff', 'Mainstream', 'iPad 10'),
            makeModel('ipad-pro-11', 'iPad Pro 11', 'High-end workhorse for power users.', 62200, '#c1adff', 'Pro', 'Pro 11'),
        ],
        samsung: [
            makeModel('tab-s9', 'Galaxy Tab S9', 'Thin, premium and built for productivity.', 54200, '#2fe0c0', 'Premium', 'S9'),
            makeModel('tab-s9-fe', 'Galaxy Tab S9 FE', 'Balanced feature set and easy resale.', 33200, '#41e7c6', 'Value', 'S9 FE'),
            makeModel('tab-a9+', 'Galaxy Tab A9+', 'Affordable family tablet with broad demand.', 18200, '#63edcf', 'Family', 'A9+'),
        ],
        lenovo: [
            makeModel('m10-plus', 'Tab M10 Plus', 'Media tablet with dependable value.', 17200, '#f29cc7', 'Media', 'M10'),
            makeModel('y700', 'Legion Y700', 'Gaming tablet with niche demand.', 35200, '#f5a7d3', 'Gaming', 'Y700'),
            makeModel('p11-pro', 'Tab P11 Pro', 'Work-ready tablet with keyboard support.', 27200, '#f8b8dc', 'Work', 'P11'),
        ],
    },
    laptops: {
        apple: [
            makeModel('macbook-air-m2', 'MacBook Air M2', 'Thin, quiet and evergreen resale value.', 76200, '#a88cff', 'Thin', 'MBA M2'),
            makeModel('macbook-pro-m3', 'MacBook Pro M3', 'Creator laptop with premium checkout appeal.', 114200, '#b59cff', 'Pro', 'MBP M3'),
            makeModel('macbook-air-m1', 'MacBook Air M1', 'Iconic model with huge market demand.', 52200, '#c1adff', 'Classic', 'MBA M1'),
        ],
        hp: [
            makeModel('hp-elitebook', 'EliteBook 840', 'Business-grade build with strong corporate resale.', 36200, '#5fd3ff', 'Business', 'EliteBook'),
            makeModel('hp-pavilion', 'Pavilion 14', 'Balanced everyday laptop for students.', 24200, '#71ddff', 'Student', 'Pavilion'),
            makeModel('hp-omen', 'OMEN 16', 'Gaming laptop with good second-hand traction.', 54200, '#84e4ff', 'Gaming', 'OMEN'),
        ],
        lenovo: [
            makeModel('thinkpad-x1', 'ThinkPad X1', 'Premium keyboard, premium buyers.', 44200, '#f29cc7', 'Premium', 'X1'),
            makeModel('ideapad-slim', 'IdeaPad Slim 5', 'Solid everyday laptop with practical value.', 26200, '#f5a7d3', 'Everyday', 'Slim 5'),
            makeModel('legion-5', 'Legion 5', 'Gaming laptop with high demand.', 56200, '#f8b8dc', 'Gaming', 'Legion 5'),
        ],
    },
    mac: {
        apple: [
            makeModel('mac-studio-m2', 'Mac Studio M2', 'Desktop-class power with premium buyers.', 127200, '#7c8cff', 'Studio', 'Studio'),
            makeModel('macbook-pro-14', 'MacBook Pro 14', 'Workhorse for pros and creators.', 132200, '#8f9cff', 'Pro', 'MBP 14'),
            makeModel('mac-mini-m2', 'Mac mini M2', 'Compact and easy to trade.', 48200, '#9ba8ff', 'Compact', 'Mini M2'),
        ],
    },
    watch: {
        apple: [
            makeModel('watch-series-9', 'Apple Watch Series 9', 'Premium smartwatch with fast resale.', 35200, '#7c8cff', 'Popular', 'S9'),
            makeModel('watch-se-2', 'Apple Watch SE 2', 'Best balance of price and buyer demand.', 21200, '#8f9cff', 'Value', 'SE 2'),
            makeModel('watch-ultra-2', 'Apple Watch Ultra 2', 'Rugged premium smartwatch with a niche crowd.', 68200, '#9ba8ff', 'Ultra', 'Ultra 2'),
        ],
        samsung: [
            makeModel('watch-6', 'Galaxy Watch 6', 'Android favourite with stylish appeal.', 27200, '#2fe0c0', 'Android', 'Watch 6'),
            makeModel('watch-6-classic', 'Galaxy Watch 6 Classic', 'Rotating bezel and premium feel.', 31200, '#41e7c6', 'Classic', 'Classic'),
            makeModel('watch-fe', 'Galaxy Watch FE', 'Entry-level smartwatch with wide demand.', 18200, '#63edcf', 'Entry', 'FE'),
        ],
    },
    bike: {
        hero: [
            makeModel('splendor-plus', 'Splendor Plus', 'India’s evergreen commuter with broad demand.', 48200, '#ffd166', 'Commuter', 'Splendor', 1800),
            makeModel('xpulse-200', 'Xpulse 200', 'Adventure bike with a niche resale audience.', 91200, '#ffe08a', 'Adventure', 'Xpulse', 2500),
            makeModel('destini-125', 'Destini 125', 'Practical scooter with easy valuation.', 38200, '#fff0b3', 'Scooter', 'Destini', 1200),
        ],
        tvs: [
            makeModel('apache-rr310', 'Apache RR 310', 'Premium sports bike with enthusiast demand.', 143200, '#61d6ce', 'Sport', 'RR 310', 3000),
            makeModel('apache-160', 'Apache RTR 160', 'Popular commuter-sport with strong liquidity.', 69200, '#79ddd6', 'Popular', 'RTR 160', 2000),
            makeModel('jupiter', 'Jupiter 125', 'Trusted scooter with consistent resale demand.', 41200, '#90e4de', 'Scooter', 'Jupiter', 1400),
        ],
        suzuki: [
            makeModel('access-125', 'Access 125', 'Best-selling scooter with fast resale.', 39200, '#ff9d96', 'Best-seller', 'Access 125', 1400),
            makeModel('gixxer-155', 'Gixxer 155', 'Stylish roadster with niche appeal.', 70200, '#ffb0a8', 'Roadster', 'Gixxer 155', 2200),
            makeModel('burgman-street', 'Burgman Street', 'Premium scooter with steady value.', 45200, '#ffc3bd', 'Premium', 'Burgman', 1600),
        ],
    },
};

export const sellQuestions = [
    { key: 'calls', label: 'Can the device make and receive calls?', type: 'yesno' },
    { key: 'touch', label: 'Is the screen touch fully responsive?', type: 'yesno' },
    { key: 'camera', label: 'Does the camera work without issues?', type: 'yesno' },
    { key: 'charger', label: 'Do you have the original charger?', type: 'yesno' },
    { key: 'box', label: 'Do you still have the original box?', type: 'yesno' },
];

export const defectDeductions: Record<string, number> = {
    'broken-screen': 6500,
    'dead-pixels': 2200,
    'body-dents': 1800,
    'panel-broken': 4200,
    'battery-weak': 1800,
    'camera-damaged': 1600,
};

export const defectLabels: Record<string, string> = {
    'broken-screen': 'Broken screen',
    'dead-pixels': 'Dead pixels',
    'body-dents': 'Body dents',
    'panel-broken': 'Panel broken',
    'battery-weak': 'Battery weak',
    'camera-damaged': 'Camera issue',
};

export const accessoryBonus = {
    charger: 700,
    box: 500,
    bill: 900,
};

export const reviews = [
    { name: 'Aarav', role: 'Mumbai', text: 'Classy UI and quick quote flow. It feels polished on mobile.' },
    { name: 'Meera', role: 'Pune', text: 'The responsive layouts are clean and easy to navigate.' },
    { name: 'Kabir', role: 'Bengaluru', text: 'Everything important is there: pricing, orders, and support.' },
];

export const faqs = [
    { q: 'How fast is the quote?', a: 'You get an instant estimate as soon as the device and condition are selected.' },
    { q: 'Do I need the box?', a: 'No, but keeping the box and charger usually improves the final offer.' },
    { q: 'How is pickup scheduled?', a: 'After checkout, pick a time slot and store it as an order in the app.' },
    { q: 'Is the app mobile-first?', a: 'Yes, every screen is tuned to look clean and premium on phones.' },
];

export const blogs = [
    { title: 'How to get the highest resale value', tag: 'Guide', desc: 'A short checklist that protects your final offer.' },
    { title: 'Why clean devices sell faster', tag: 'Tips', desc: 'Packaging, accessories and presentation matter more than most people think.' },
    { title: 'What buyers look for in used phones', tag: 'Market', desc: 'Condition, battery health, and demand are the major pricing levers.' },
];

export const staticPages: Record<string, StaticPageContent> = {
    'about-us': {
        title: 'About Recello',
        eyebrow: 'Company',
        hero: 'A premium resale experience for modern devices.',
        body: [
            'Recello is designed to feel fast, elegant, and easy on every screen size.',
            'The app focuses on device evaluation, pricing confidence, and smooth conversion from quote to order.',
        ],
        bullets: ['Responsive design first', 'Clean mobile flows', 'Modern premium visual language'],
    },
    'cookie-policy': { title: 'Cookie Policy', eyebrow: 'Policy', hero: 'Transparent cookie handling.', body: ['Only essential cookies and app state storage are used to improve the experience.'] },
    'e-waste-policy': { title: 'E-Waste Policy', eyebrow: 'Policy', hero: 'Responsible device recycling.', body: ['We encourage resale, reuse, and safe recycling to reduce e-waste footprint.'] },
    'privacy-policy': { title: 'Privacy Policy', eyebrow: 'Policy', hero: 'Your data stays controlled.', body: ['Contact and order details are stored securely for the user journey and support flow.'] },
    'refund-policy': { title: 'Refund Policy', eyebrow: 'Policy', hero: 'Clear cancellation and support rules.', body: ['Pickup orders and offers can be reviewed before confirmation.'] },
    'terms-conditions': { title: 'Terms & Conditions', eyebrow: 'Policy', hero: 'Simple usage terms.', body: ['The platform is provided for quote, order, and support workflows with fair-use expectations.'] },
    'warranty-policy': { title: 'Warranty Policy', eyebrow: 'Policy', hero: 'Warranty guidance for resold devices.', body: ['Warranty and device condition depend on the selected product and seller disclosures.'] },
    faq: {
        title: 'Frequently Asked Questions',
        eyebrow: 'Support',
        hero: 'Answers to the most common sell-flow questions.',
        body: ['If anything is unclear, the FAQ screen keeps the design tidy and readable on mobile.'],
    },
    blogs: {
        title: 'Blogs',
        eyebrow: 'Insights',
        hero: 'Short reads to help users sell smarter.',
        body: ['Blog cards are presented as a clean, responsive grid for quick browsing.'],
    },
};

export const defaultContactCopy = {
    title: 'Contact Us',
    eyebrow: 'Support',
    hero: 'Reach the team with a polished form and quick contact details.',
};

export const authCopy = {
    login: {
        title: 'Login',
        hero: 'Sign in to track offers and pickup orders.',
        button: 'Continue',
    },
    partner: {
        title: 'Become a Partner',
        hero: 'Join the resale network with one elegant application.',
        button: 'Apply now',
    },
};
