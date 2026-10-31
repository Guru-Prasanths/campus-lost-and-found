// Campus Lost & Found Dataset for GitHub Pages Public Deployment
// 50 Unique Lost Items + 20 Unique Found Items = 70 Total Items
const CAMPUS_ITEMS = [
  // 50 LOST ITEMS
  {
    id: 1,
    name: "Apple MacBook Pro 14\" M2 (Space Grey)",
    category: "ELECTRONICS",
    categoryDisplay: "Electronics",
    type: "LOST",
    location: "Central Library - 2nd Floor Silent Zone Desk 18",
    date: "2026-10-30",
    time: "15:30",
    image: "macbook-pro.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Space Grey MacBook Pro 14-inch with M2 Pro chip. Kept inside an inateck dark grey felt sleeve.",
    privateDetails: "Serial # C02G789XYZ, Sticker of GitHub Octocat on bottom right corner."
  },
  {
    id: 2,
    name: "Student Identity Card - Computer Science Dept",
    category: "ID_CARDS",
    categoryDisplay: "ID Cards",
    type: "LOST",
    location: "Block C - Room 302 Lecture Hall",
    date: "2026-10-29",
    time: "11:15",
    image: "student-id.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Laminated student ID card with blue campus lanyard and transparent cardholder.",
    privateDetails: "Name: Aarav Sharma, Roll CS202401, barcode ending in 5521."
  },
  {
    id: 3,
    name: "Navy Blue Leather Bi-Fold Wallet",
    category: "WALLETS_MONEY",
    categoryDisplay: "Wallets & Money",
    type: "LOST",
    location: "Sports Complex - Basketball Court Bleachers",
    date: "2026-10-28",
    time: "17:45",
    image: "leather-wallet.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Dark navy blue bi-fold leather wallet with contrast tan stitching along perimeter.",
    privateDetails: "Contains Rs. 850 in cash, SBI Global debit card, college bus pass."
  },
  {
    id: 4,
    name: "Sony WH-1000XM4 Noise Canceling Headphones",
    category: "ELECTRONICS",
    categoryDisplay: "Electronics",
    type: "LOST",
    location: "Auditorium Hall B - Row 4 Seat 12",
    date: "2026-10-27",
    time: "14:20",
    image: "sony-headphones.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Prof. Rajesh Nair",
    description: "Matte black over-ear Bluetooth headphones stored inside the original zipper hardshell carry case.",
    privateDetails: "Slight hairline scratch on right swivel hinge, contains 3.5mm braided aux cable."
  },
  {
    id: 5,
    name: "Data Structures & Algorithms Hardcover Lecture Notes",
    category: "BOOKS_NOTES",
    categoryDisplay: "Books & Notes",
    type: "LOST",
    location: "Central Library - Ground Floor Reading Room 3",
    date: "2026-10-26",
    time: "16:40",
    image: "dsa-notes.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Thick Classmate spiral hardcover notebook containing handwritten notes on trees, graphs, and dynamic programming.",
    privateDetails: "First page inscribed: 'Aarav Sharma - Sem 4 DS Notes'."
  },
  {
    id: 6,
    name: "Milton Thermosteel 1000ml Stainless Steel Bottle",
    category: "ACCESSORIES",
    categoryDisplay: "Accessories",
    type: "LOST",
    location: "Main Campus Canteen - Juice Counter Table",
    date: "2026-10-29",
    time: "13:10",
    image: "water-bottle.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Silver insulated double-walled water flask with flip-top drinking spout and black carry handle.",
    privateDetails: "Small dent on bottom rim, white masking tape with initial 'A.S.' on bottom."
  },
  {
    id: 7,
    name: "Yamaha FZ Bike Key with Spider-Man Keychain",
    category: "KEYS",
    categoryDisplay: "Keys",
    type: "LOST",
    location: "Student Two-Wheeler Parking - Bay 4",
    date: "2026-10-30",
    time: "09:20",
    image: "keys-keychain.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Single black-headed Yamaha ignition key attached to a red rubber Spider-Man mask keychain.",
    privateDetails: "Key number stamped Y-4819, small silver padlock key on the same split ring."
  },
  {
    id: 8,
    name: "Wildcraft 35L Navy Blue College Backpack",
    category: "BAGS",
    categoryDisplay: "Bags",
    type: "LOST",
    location: "College Bus Route 12 - Seat 14",
    date: "2026-10-28",
    time: "08:45",
    image: "college-backpack.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Navy blue Wildcraft water-resistant daypack with two main zippered compartments and side mesh water pouch.",
    privateDetails: "Inside front pocket has a blue Parker pen and a USB OTG drive."
  },
  {
    id: 9,
    name: "Casio fx-991EX ClassWiz Scientific Calculator",
    category: "ELECTRONICS",
    categoryDisplay: "Electronics",
    type: "LOST",
    location: "Engineering Mathematics Lab - Block B Room 204",
    date: "2026-10-27",
    time: "12:00",
    image: "calculator.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "High-resolution natural textbook display calculator with carbon-fiber patterned slide-on hard cover.",
    privateDetails: "Name written in permanent silver marker on the inside of the slide cover: 'AARAV S'."
  },
  {
    id: 10,
    name: "Apple iPhone 13 128GB (Midnight Black)",
    category: "ELECTRONICS",
    categoryDisplay: "Electronics",
    type: "LOST",
    location: "Seminar Hall 1 - Row F Seat 8",
    date: "2026-10-30",
    time: "15:00",
    image: "iphone-black.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Midnight black iPhone 13 in a translucent matte black Spigen shockproof case with tempered glass screen.",
    privateDetails: "Lock screen photo shows a golden retriever, IMEI ends in 4102."
  },
  {
    id: 11,
    name: "Samsung Galaxy A54 5G (Awesome Violet)",
    category: "ELECTRONICS",
    categoryDisplay: "Electronics",
    type: "LOST",
    location: "Block A - 2nd Floor Corridor outside Physics Lab",
    date: "2026-10-29",
    time: "14:15",
    image: "samsung-phone.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Violet Samsung smartphone with triple camera layout and a clear silicone bumper protector.",
    privateDetails: "Lock screen displays incoming Airtel 5G notifications, pink pop-socket on rear."
  },
  {
    id: 12,
    name: "Apple AirPods 3rd Gen with MagSafe Charging Case",
    category: "ELECTRONICS",
    categoryDisplay: "Electronics",
    type: "LOST",
    location: "Boys Hostel 1 - 1st Floor Common TV Lounge",
    date: "2026-10-28",
    time: "21:30",
    image: "airpods-case.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Glossy white wireless AirPods inside standard charging case, kept inside a baby-blue silicone case sleeve.",
    privateDetails: "Bluetooth device name configured as 'Aarav's AirPods', left earbud has faint scratch."
  },
  {
    id: 13,
    name: "boAt Rockerz 255 Pro+ Wireless Bluetooth Neckband",
    category: "ELECTRONICS",
    categoryDisplay: "Electronics",
    type: "LOST",
    location: "Campus Gymnasium - Treadmill Section",
    date: "2026-10-27",
    time: "06:45",
    image: "boat-earphones.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Teal green flexible silicone neckband with magnetic metallic earbuds and IPX7 water resistance.",
    privateDetails: "Right earbud rubber tip is slightly looser than the left, micro-USB port flap intact."
  },
  {
    id: 14,
    name: "HP 65W USB Type-C Original Laptop Power Adapter",
    category: "ELECTRONICS",
    categoryDisplay: "Electronics",
    type: "LOST",
    location: "Central Library - Digital Laptop Charging Bay Counter",
    date: "2026-10-26",
    time: "16:10",
    image: "laptop-charger.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Black OEM HP laptop power brick with attached Type-C charging cord and detachable 3-prong Indian wall plug.",
    privateDetails: "Yellow electrical tape wrapped around the cable strain relief neck."
  },
  {
    id: 15,
    name: "University Physics with Modern Physics 14th Edition Textbook",
    category: "BOOKS_NOTES",
    categoryDisplay: "Books & Notes",
    type: "LOST",
    location: "Physics Lecture Hall 101 - Front Row Desk",
    date: "2026-10-25",
    time: "10:30",
    image: "engineering-book.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Prof. Rajesh Nair",
    description: "Thick hardcover Young & Freedman physics textbook covered in transparent plastic protective wrap.",
    privateDetails: "Inside title page stamped with college library barcode: 'LIB-PHY-8842'."
  },
  {
    id: 16,
    name: "Mechanical Engineering Workshop Observation Record",
    category: "DOCUMENTS",
    categoryDisplay: "Documents",
    type: "LOST",
    location: "Machine Tools & Carpentry Laboratory",
    date: "2026-10-29",
    time: "16:00",
    image: "lab-record-file.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Hardbound red rexine workshop record notebook containing certified lathe and welding experiment sheets.",
    privateDetails: "Roll CS202401 inscribed on index, signed by Lab Incharge on page 14."
  },
  {
    id: 17,
    name: "Casio Vintage Digital Watch (Silver Stainless Steel)",
    category: "ACCESSORIES",
    categoryDisplay: "Accessories",
    type: "LOST",
    location: "Chemistry Lab 2 - Sink & Wash Area",
    date: "2026-10-24",
    time: "15:20",
    image: "casio-watch.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Classic silver stainless steel bracelet digital watch with illuminator amber backlight and alarm functions.",
    privateDetails: "Model A168W, bracelet sized to 6.5 inch wrist with 2 links removed."
  },
  {
    id: 18,
    name: "Noise ColorFit Pulse 2 Smartwatch with Olive Green Strap",
    category: "ELECTRONICS",
    categoryDisplay: "Electronics",
    type: "LOST",
    location: "College Sports Ground - Football Pavilion Benches",
    date: "2026-10-28",
    time: "18:15",
    image: "smart-watch.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Square 1.8-inch touch display fitness smartwatch with matte olive silicone strap and magnetic pin charger.",
    privateDetails: "Battery at approx 45%, custom watch face featuring a mountain sunrise illustration."
  },
  {
    id: 19,
    name: "Lenskart Air Matte Black Rectangular Spectacles",
    category: "ACCESSORIES",
    categoryDisplay: "Accessories",
    type: "LOST",
    location: "Block A - Classroom 204",
    date: "2026-10-29",
    time: "11:45",
    image: "reading-glasses.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Ultra-lightweight TR90 rectangular spectacle frames with anti-reflective blue-cut prescription lenses.",
    privateDetails: "Power -1.50 D both eyes, stored inside a black triangular fold magnetic case."
  },
  {
    id: 20,
    name: "Fastrack Aviator Polarized Sunglasses in Hard Leatherette Case",
    category: "ACCESSORIES",
    categoryDisplay: "Accessories",
    type: "LOST",
    location: "Campus Open Cafeteria - Wooden Table 7",
    date: "2026-10-26",
    time: "13:30",
    image: "sunglasses-case.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Gunmetal finish metal aviator frames with dark green polarized lenses and comfort silicone nose pads.",
    privateDetails: "Right temple arm has tiny Fastrack logo, case includes branded grey microfibre wipe."
  },
  {
    id: 21,
    name: "SanDisk Ultra Dual Drive 64GB USB 3.1 OTG Flash Drive",
    category: "ELECTRONICS",
    categoryDisplay: "Electronics",
    type: "LOST",
    location: "CAD/CAM Computer Center Lab 2 - Workstation 19",
    date: "2026-10-30",
    time: "17:10",
    image: "usb-flash-drive.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Silver metallic swivel flash drive with dual Type-A and Type-C connectors.",
    privateDetails: "Volume label: 'AARAV_64G', contains SolidWorks tutorial project files."
  },
  {
    id: 22,
    name: "Parker Vector Matte Black Fountain Pen in Presentation Box",
    category: "OTHER",
    categoryDisplay: "Other",
    type: "LOST",
    location: "Examination Hall 4 - Desk 32",
    date: "2026-10-28",
    time: "12:30",
    image: "parker-pen.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Matte black barrel fountain pen with stainless steel fine nib and signature Parker arrow clip.",
    privateDetails: "Fitted with blue Quink ink converter cartridge, initial 'AS' engraved on cap."
  },
  {
    id: 23,
    name: "Canvas Zippered Stationery Pouch with Technical Drawing Pens",
    category: "OTHER",
    categoryDisplay: "Other",
    type: "LOST",
    location: "Architecture & Civil Drawing Studio 2",
    date: "2026-10-27",
    time: "16:20",
    image: "pencil-pouch.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Grey durable canvas pouch containing Staedtler pigment liners, 2B mechanical pencils, and metal scale.",
    privateDetails: "Contains 0.2, 0.4, and 0.8mm drafting pens and an art eraser."
  },
  {
    id: 24,
    name: "Cello Sports 750ml Plastic Water Bottle with Sipper Cap",
    category: "ACCESSORIES",
    categoryDisplay: "Accessories",
    type: "LOST",
    location: "Badminton Indoor Court 2 - Bench Side",
    date: "2026-10-29",
    time: "18:00",
    image: "sipper-bottle.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "BPA-free clear translucent sports bottle with neon green measurement markings and silicone grip strap.",
    privateDetails: "Scratch on the cap lock mechanism, contains lemon water residue."
  },
  {
    id: 25,
    name: "Beige Canvas Tote Bag with Embroidered Quotes",
    category: "BAGS",
    categoryDisplay: "Bags",
    type: "LOST",
    location: "Girls Hostel B - Study Lounge Table",
    date: "2026-10-28",
    time: "20:15",
    image: "tote-bag.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Heavyweight natural cotton tote bag with long shoulder straps and 'Think Outside the Box' embroidery.",
    privateDetails: "Contains a pink spiral notebook and a pocket sanitiser spray."
  },
  {
    id: 26,
    name: "Dell Inspiron 15 3520 Laptop (Platinum Silver)",
    category: "ELECTRONICS",
    categoryDisplay: "Electronics",
    type: "LOST",
    location: "Electronics & Communication Dept - Seminar Room",
    date: "2026-10-27",
    time: "15:45",
    image: "dell-laptop.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "15.6-inch Full HD Dell laptop powered by Intel Core i5 with narrow bezel display.",
    privateDetails: "Service Tag: 8K9L2M3, sticker of Linux Tux penguin next to trackpad."
  },
  {
    id: 27,
    name: "Compact Blue Foldable Windproof Umbrella",
    category: "ACCESSORIES",
    categoryDisplay: "Accessories",
    type: "LOST",
    location: "Main Administration Building - Entrance Portico Umbrella Stand",
    date: "2026-10-30",
    time: "10:00",
    image: "umbrella-blue.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Three-fold royal blue umbrella with automatic push-button open/close and rubberized slip-proof handle.",
    privateDetails: "Matching blue nylon sleeve pouch included, silver metal ribs reinforced with fiberglass."
  },
  {
    id: 28,
    name: "Hostel Room D-204 Brass Key with Room Tag",
    category: "KEYS",
    categoryDisplay: "Keys",
    type: "LOST",
    location: "Hostel Dining Mess - Central Table Row",
    date: "2026-10-29",
    time: "20:45",
    image: "dorm-keys.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Standard 7-lever brass door key attached to a circular blue plastic tag inscribed with 'D-204'.",
    privateDetails: "Key has slight bend on tip, serial stamped 411."
  },
  {
    id: 29,
    name: "Women's Burgundy Leather Clutch Wallet",
    category: "WALLETS_MONEY",
    categoryDisplay: "Wallets & Money",
    type: "LOST",
    location: "Central Library - Circulation Return Counter",
    date: "2026-10-26",
    time: "14:00",
    image: "womens-purse.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Textured burgundy faux-leather clutch wallet with gold-toned metal zipper and interior card organizer.",
    privateDetails: "Contains college canteen smart card, Aadhaar photocopy, and Rs. 420 cash."
  },
  {
    id: 30,
    name: "Mi 20000mAh Power Bank 3i (Sandstone Black)",
    category: "ELECTRONICS",
    categoryDisplay: "Electronics",
    type: "LOST",
    location: "Student Activity Center - 1st Floor Recliner Lounge",
    date: "2026-10-28",
    time: "17:30",
    image: "portable-powerbank.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Heavy-duty black textured power bank with dual USB-A output ports and 18W fast charging support.",
    privateDetails: "Connected to a 6-inch braided black USB-C cable, four LED battery indicators."
  },
  {
    id: 31,
    name: "Mechanical Engineering Graphics Mini-Drafter Kit",
    category: "OTHER",
    categoryDisplay: "Other",
    type: "LOST",
    location: "Drawing Hall 1 - Drafting Table 18",
    date: "2026-10-25",
    time: "13:00",
    image: "engineering-book.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Standard black arm engineering drafting machine with transparent acrylic protractor scale in black leatherette pouch.",
    privateDetails: "White correction fluid marking with 'SEC-B' on the clamp knob."
  },
  {
    id: 32,
    name: "Student Identity Card - Electrical & Electronics Dept",
    category: "ID_CARDS",
    categoryDisplay: "ID Cards",
    type: "LOST",
    location: "Electrical Machines Laboratory 1 - Panel 4",
    date: "2026-10-29",
    time: "15:10",
    image: "student-id.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Laminated plastic ID badge with green EEE department header bar and steel crocodile clip lanyard.",
    privateDetails: "Name: Priya S., Roll EE202315, valid till 2027."
  },
  {
    id: 33,
    name: "Fastrack Black Silicone Digital Sports Watch",
    category: "ACCESSORIES",
    categoryDisplay: "Accessories",
    type: "LOST",
    location: "College Athletic Track - Concrete Spectator Benches",
    date: "2026-10-27",
    time: "07:30",
    image: "casio-watch.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Rugged all-black digital sports wristwatch with water-resistant casing and stopwatch feature.",
    privateDetails: "Strap buckle shows slight scuff on the top left edge."
  },
  {
    id: 34,
    name: "Operating Systems Concepts (Silberschatz) Hardcover Book",
    category: "BOOKS_NOTES",
    categoryDisplay: "Books & Notes",
    type: "LOST",
    location: "Block C - 4th Floor Corridor Bench near Lift",
    date: "2026-10-24",
    time: "16:15",
    image: "dsa-notes.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Classic 'Dinosaur' operating systems 10th edition textbook with blue and green illustrated cover.",
    privateDetails: "Contains sticky notes marking chapter on Deadlocks and Virtual Memory."
  },
  {
    id: 35,
    name: "Hydro Flask 32oz Wide Mouth Bottle (Pacific Blue)",
    category: "ACCESSORIES",
    categoryDisplay: "Accessories",
    type: "LOST",
    location: "Tennis Court - Spectator Bleachers Row 2",
    date: "2026-10-30",
    time: "17:45",
    image: "water-bottle.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Vacuum insulated dark blue stainless steel flask with black flex cap and carry loop.",
    privateDetails: "Sticker of NASA meatball logo affixed near the middle section."
  },
  {
    id: 36,
    name: "Titan Neo Analog Watch with Brown Leather Strap",
    category: "ACCESSORIES",
    categoryDisplay: "Accessories",
    type: "LOST",
    location: "Placement Cell - Interview Waiting Room 2",
    date: "2026-10-28",
    time: "11:30",
    image: "smart-watch.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Prof. Rajesh Nair",
    description: "Rose gold plated round dial dress watch with white indices and genuine brown stitched leather strap.",
    privateDetails: "Date window set to 28th, small warranty sticker on rear caseback."
  },
  {
    id: 37,
    name: "Lenovo 65W Round-Tip Power Adapter for IdeaPad",
    category: "ELECTRONICS",
    categoryDisplay: "Electronics",
    type: "LOST",
    location: "Block B - Room 108 Smart Classroom",
    date: "2026-10-26",
    time: "14:40",
    image: "laptop-charger.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Standard Lenovo AC charger with 4.0mm barrel tip connector and velcro cable tidy strap.",
    privateDetails: "Input: 100-240V, Output: 20V 3.25A, barcode serial ends in 9102."
  },
  {
    id: 38,
    name: "Honda Activa Key with Minion Rubber Keychain",
    category: "KEYS",
    categoryDisplay: "Keys",
    type: "LOST",
    location: "Two-Wheeler Parking - Gate 2 Shed",
    date: "2026-10-29",
    time: "13:15",
    image: "keys-keychain.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Silver ignition scooter key with Honda wing emblem and bright yellow Minion cartoon rubber charm.",
    privateDetails: "Activa 6G key with shutter lock magnetic hexagonal head."
  },
  {
    id: 39,
    name: "American Tourister 15.6\" Laptop Backpack (Grey & Black)",
    category: "BAGS",
    categoryDisplay: "Bags",
    type: "LOST",
    location: "College Bus Route 4 - Overhead Luggage Rack",
    date: "2026-10-27",
    time: "09:10",
    image: "college-backpack.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Durable nylon multi-compartment executive college backpack with padded ergonomic shoulder straps.",
    privateDetails: "Contains an umbrella in the left bottle holder and a college identity tag."
  },
  {
    id: 40,
    name: "Casio fx-82MS 2nd Edition Scientific Calculator",
    category: "ELECTRONICS",
    categoryDisplay: "Electronics",
    type: "LOST",
    location: "Civil Engineering Surveying Lab - Block D",
    date: "2026-10-25",
    time: "11:20",
    image: "calculator.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Standard non-programmable 2-line display scientific calculator with grey slide cover.",
    privateDetails: "Solar cell section has a tiny green circular sticker."
  },
  {
    id: 41,
    name: "OnePlus Bullets Wireless Z2 Neckband (Magico Black)",
    category: "ELECTRONICS",
    categoryDisplay: "Electronics",
    type: "LOST",
    location: "Main Campus Canteen - Fruit Juice Corner",
    date: "2026-10-28",
    time: "13:50",
    image: "boat-earphones.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Deep black wireless magnetic in-ear neckband earphones with red accent rings on the driver housings.",
    privateDetails: "Magnetic snap-to-pause works cleanly, medium silicone tips attached."
  },
  {
    id: 42,
    name: "Student Identity Card - Biotechnology Dept",
    category: "ID_CARDS",
    categoryDisplay: "ID Cards",
    type: "LOST",
    location: "Biotechnology Research Block A - Ground Floor Foyer",
    date: "2026-10-30",
    time: "16:30",
    image: "student-id.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Laminated student ID card with green border lanyard and department library stamp on back.",
    privateDetails: "Name: Kavya M., Roll BT21044, barcode ending in 9012."
  },
  {
    id: 43,
    name: "Rimless Reading Glasses in Black Magnetic Case",
    category: "ACCESSORIES",
    categoryDisplay: "Accessories",
    type: "LOST",
    location: "Main Library - Periodicals & Newspaper Section",
    date: "2026-10-26",
    time: "15:00",
    image: "reading-glasses.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Prof. Rajesh Nair",
    description: "Sleek titanium rimless prescription spectacles with flexible wire temples and transparent nose rests.",
    privateDetails: "Left temple marked 'Titan 52-18-140', case has red velvet interior."
  },
  {
    id: 44,
    name: "Kingston DataTraveler 32GB Metal USB Flash Drive",
    category: "ELECTRONICS",
    categoryDisplay: "Electronics",
    type: "LOST",
    location: "Microprocessor Laboratory - Systems Desk 14",
    date: "2026-10-27",
    time: "16:50",
    image: "usb-flash-drive.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Ultra-compact capless silver metallic USB 3.0 thumb drive with ring loop design.",
    privateDetails: "Drive labeled 'KINSTON_32G', contains 8086 MASM assembly source code."
  },
  {
    id: 45,
    name: "Brown Tri-Fold RFID-Blocking Leather Wallet",
    category: "WALLETS_MONEY",
    categoryDisplay: "Wallets & Money",
    type: "LOST",
    location: "College Bookstore & Stationery - Billing Counter",
    date: "2026-10-29",
    time: "12:10",
    image: "leather-wallet.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Dark brown genuine leather tri-fold wallet with embossed Wildhorn logo and transparent ID window.",
    privateDetails: "Contains Rs. 1200 in 500-rupee notes, HDFC debit card, Metro smart card."
  },
  {
    id: 46,
    name: "Analog Electronics Spiral-Bound Lecture Notes",
    category: "BOOKS_NOTES",
    categoryDisplay: "Books & Notes",
    type: "LOST",
    location: "Block B - 2nd Floor Staircase Landing Bench",
    date: "2026-10-28",
    time: "14:00",
    image: "dsa-notes.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Thick A4 spiral register filled with circuit schematics, operational amplifier derivations, and lab observations.",
    privateDetails: "Blue cardstock cover inscribed 'Analog Integrated Circuits - Unit 1-4'."
  },
  {
    id: 47,
    name: "Borosil Glass Flask with Neoprene Protective Sleeve",
    category: "ACCESSORIES",
    categoryDisplay: "Accessories",
    type: "LOST",
    location: "Chemistry Analytical Laboratory 3 - Side Counter",
    date: "2026-10-24",
    time: "11:45",
    image: "water-bottle.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "550ml borosilicate glass hydration bottle encased in a zippered grey neoprene insulating sleeve.",
    privateDetails: "Stainless steel cap with silicone leak-proof gasket and rope strap."
  },
  {
    id: 48,
    name: "Campus Gym Duffel Bag with Pair of Lifting Straps",
    category: "BAGS",
    categoryDisplay: "Bags",
    type: "LOST",
    location: "Campus Sports Complex - Gym Locker Room 11",
    date: "2026-10-29",
    time: "19:15",
    image: "tote-bag.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Black water-resistant cylindrical gym bag with dual carry handles, padded shoulder strap, and side shoe pocket.",
    privateDetails: "Contains a grey microfiber sweat towel and black cotton wrist wraps."
  },
  {
    id: 49,
    name: "Ray-Ban Wayfarer Classic Black Sunglasses",
    category: "ACCESSORIES",
    categoryDisplay: "Accessories",
    type: "LOST",
    location: "Auditorium - Open-Air Amphitheatre Stone Steps",
    date: "2026-10-27",
    time: "17:00",
    image: "sunglasses-case.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Classic glossy black acetate frames with signature G-15 green mineral glass lenses.",
    privateDetails: "Silver metal rivets on temple tips, Ray-Ban white print on top edge of right lens."
  },
  {
    id: 50,
    name: "Hostel Cupboard Godrej Brass Padlock Keys (Set of 2)",
    category: "KEYS",
    categoryDisplay: "Keys",
    type: "LOST",
    location: "Boys Hostel 2 - Ground Floor Water Cooler Area",
    date: "2026-10-30",
    time: "22:10",
    image: "dorm-keys.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Two identical small brass Godrej padlock keys linked together on a small silver split key ring.",
    privateDetails: "Both keys stamped with code 'G-8821'."
  },

  // 20 UNIQUE FOUND ITEMS WITH INTERACTIVE VERIFICATION QUIZ
  {
    id: 51,
    name: "Found: Apple MacBook Air M1 (Silver, Transparent Hard Shell)",
    category: "ELECTRONICS",
    categoryDisplay: "Electronics",
    type: "FOUND",
    location: "Central Digital Library - Terminal Desk 7",
    date: "2026-10-30",
    time: "16:20",
    image: "macbook-pro.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Prof. Rajesh Nair",
    description: "Silver 13-inch MacBook Air found left unattended at a computer terminal. Protected by a clear snap-on case.",
    quiz: [
      {
        q: "What is the exterior color and casing of this found MacBook Air?",
        options: ["Space Grey with a black silicone skin", "Silver with a clear transparent snap-on hard shell", "Gold with carbon-fiber adhesive wrap", "Midnight with university logo"],
        correct: 1
      },
      {
        q: "In which specific campus location was this laptop discovered?",
        options: ["Central Digital Library - Terminal Desk 7", "Main Cafeteria billing register", "Auditorium green room dressing desk", "Boys Hostel TV lounge"],
        correct: 0
      },
      {
        q: "Which processor architecture does this laptop feature?",
        options: ["Intel Core i7 11th Gen", "Apple M1 chip", "AMD Ryzen 5 5600U", "Apple M3 Max"],
        correct: 1
      },
      {
        q: "What wallpaper is set on the lock screen?",
        options: ["Default Monterey purple waves", "Swiss alpine lake scene", "Anime hero character", "Plain dark grey background"],
        correct: 1
      }
    ]
  },
  {
    id: 52,
    name: "Found: Student ID Card - Mechanical Engineering Dept",
    category: "ID_CARDS",
    categoryDisplay: "ID Cards",
    type: "FOUND",
    location: "Main Campus Canteen - Billing Register Counter",
    date: "2026-10-29",
    time: "13:40",
    image: "student-id.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Prof. Rajesh Nair",
    description: "Laminated campus smart identity card discovered near the main cafeteria billing counter.",
    quiz: [
      {
        q: "What student name is printed on this found ID card?",
        options: ["Aarav Sharma", "Rohan K.", "Vikram Verma", "Priya S."],
        correct: 1
      },
      {
        q: "Which academic department is indicated on the card header?",
        options: ["Mechanical Engineering", "Computer Science", "Civil Engineering", "Biotechnology"],
        correct: 0
      },
      {
        q: "What are the last 4 digits of the barcode printed on this ID card?",
        options: ["1124", "5521", "7741", "9012"],
        correct: 2
      }
    ]
  },
  {
    id: 53,
    name: "Found: Tommy Hilfiger Black Bi-Fold Leather Wallet",
    category: "WALLETS_MONEY",
    categoryDisplay: "Wallets & Money",
    type: "FOUND",
    location: "Sports Ground - West Stand Bleachers Row 3",
    date: "2026-10-28",
    time: "18:00",
    image: "leather-wallet.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Genuine black smooth leather wallet with iconic red, white, and navy ribbon stripe on corner.",
    quiz: [
      {
        q: "What distinctive brand feature is located on the corner of this leather wallet?",
        options: ["Embossed brass eagle crest", "Red, white, and navy ribbon stripe emblem", "Silver metallic monogram initials", "Perforated circular leather cutout"],
        correct: 1
      },
      {
        q: "Where was this wallet found in the campus sports area?",
        options: ["West Stand Bleachers Row 3", "Badminton indoor court floor", "Gymnasium locker room 11", "Athletic track concrete bench"],
        correct: 0
      },
      {
        q: "Which bank debit card is held in the front slot of the wallet?",
        options: ["HDFC Bank Visa", "State Bank of India Global", "Canara Bank Rupay Card", "ICICI Coral Debit"],
        correct: 2
      }
    ]
  },
  {
    id: 54,
    name: "Found: JBL Tune 760NC Wireless Over-Ear Headphones (Matte Blue)",
    category: "ELECTRONICS",
    categoryDisplay: "Electronics",
    type: "FOUND",
    location: "Auditorium Stage - Green Room Dressing Counter",
    date: "2026-10-30",
    time: "19:30",
    image: "sony-headphones.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Prof. Rajesh Nair",
    description: "Foldable dark blue Bluetooth headphones with soft faux-leather ear cushions and active noise cancelling button.",
    quiz: [
      {
        q: "What is the primary color of these JBL wireless headphones?",
        options: ["Matte Blue", "Charcoal Black", "Silver Grey", "Rose Gold"],
        correct: 0
      },
      {
        q: "In which room of the Auditorium were these headphones discovered?",
        options: ["Balcony Sound Booth", "Green Room Dressing Counter", "Orchestra Pit Row 1", "Main Foyer Ticket Booth"],
        correct: 1
      },
      {
        q: "What charging cable was found tucked inside the headband curve?",
        options: ["Black braided Type-C cable", "Signature orange JBL micro-USB cable", "White lightning cable", "Yellow aux cable"],
        correct: 1
      }
    ]
  },
  {
    id: 55,
    name: "Found: Higher Engineering Mathematics (B.S. Grewal) 44th Edition",
    category: "BOOKS_NOTES",
    categoryDisplay: "Books & Notes",
    type: "FOUND",
    location: "Central Library - 1st Floor Stack Area 4",
    date: "2026-10-27",
    time: "17:15",
    image: "engineering-book.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Prof. Rajesh Nair",
    description: "Heavy yellow and blue hardcover engineering mathematics textbook discovered on an open study table.",
    quiz: [
      {
        q: "Which edition of B.S. Grewal Higher Engineering Mathematics was found?",
        options: ["41st Edition", "44th Edition", "42nd Edition", "39th Edition"],
        correct: 1
      },
      {
        q: "What topic has handwritten formula notes scribbled inside the back cover?",
        options: ["Laplace and Fourier Transforms", "Matrix Inversion", "Multiple Integrals", "Partial Differential Equations"],
        correct: 0
      },
      {
        q: "On which floor of the Central Library was this book found?",
        options: ["Ground Floor Reading Room", "1st Floor Stack Area 4", "2nd Floor Silent Zone", "3rd Floor Reference Hall"],
        correct: 1
      }
    ]
  },
  {
    id: 56,
    name: "Found: Tupperware 750ml AquaSlim Water Bottle (Translucent Blue)",
    category: "ACCESSORIES",
    categoryDisplay: "Accessories",
    type: "FOUND",
    location: "Block C - 1st Floor Water Cooler Area",
    date: "2026-10-29",
    time: "14:25",
    image: "water-bottle.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Ergonomic tapered blue plastic reusable water bottle with flip-top spill-proof drinking cap.",
    quiz: [
      {
        q: "What is the color and volume capacity of this Tupperware bottle?",
        options: ["Silver 1000ml flask", "Translucent Blue 750ml AquaSlim bottle", "Neon Green 500ml shaker", "Clear 600ml glass bottle"],
        correct: 1
      },
      {
        q: "Where on campus was this bottle left behind?",
        options: ["Block C - 1st Floor Water Cooler Area", "Main Canteen juice bar", "Basketball court bleachers", "Library 2nd floor desk"],
        correct: 0
      },
      {
        q: "What initials are faintly written with marker on the bottom base?",
        options: ["'A.S.'", "'R.K.'", "'V.V.'", "'K.M.'"],
        correct: 1
      }
    ]
  },
  {
    id: 57,
    name: "Found: Royal Enfield Classic 350 Key with Leather Strap Keychain",
    category: "KEYS",
    categoryDisplay: "Keys",
    type: "FOUND",
    location: "Faculty & Staff Parking - Slot 19",
    date: "2026-10-30",
    time: "10:15",
    image: "keys-keychain.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Prof. Rajesh Nair",
    description: "Single Royal Enfield motorcycle key attached to a dark brown leather keychain embossed with 'Made Like a Gun'.",
    quiz: [
      {
        q: "What motto is embossed onto the leather keychain attached to this key?",
        options: ["'Born to Ride'", "'Made Like a Gun'", "'Pure Motorcycling'", "'Live Fast'"],
        correct: 1
      },
      {
        q: "In which parking area slot was this key found?",
        options: ["Student Two-Wheeler Bay 4", "Faculty & Staff Parking Slot 19", "Gate 2 Scooter Shed", "Hostel 2 Cycle Stand"],
        correct: 1
      },
      {
        q: "For which motorcycle model is this ignition key designed?",
        options: ["Royal Enfield Classic 350", "Yamaha FZ-S", "KTM Duke 250", "Bajaj Pulsar NS200"],
        correct: 0
      }
    ]
  },
  {
    id: 58,
    name: "Found: Skybags 32L Red & Black Geometric College Backpack",
    category: "BAGS",
    categoryDisplay: "Bags",
    type: "FOUND",
    location: "College Bus Route 18 - Last Row Left Window",
    date: "2026-10-28",
    time: "16:50",
    image: "college-backpack.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Prof. Rajesh Nair",
    description: "Dual-tone college backpack with modern red and black geometric front panel and rain cover zipper at bottom.",
    quiz: [
      {
        q: "What geometric design pattern is featured on the front panel of this backpack?",
        options: ["All-black plain textured nylon", "Red and black geometric triangular print", "Yellow and blue stripes", "Camouflage army pattern"],
        correct: 1
      },
      {
        q: "Which college bus route was this bag left on?",
        options: ["Route 4", "Route 12", "Route 18", "Route 7"],
        correct: 2
      },
      {
        q: "What item was found inside the side mesh pouch of the bag?",
        options: ["Blue compact umbrella", "Steel water bottle", "Set of geometry instruments", "Scientific calculator"],
        correct: 0
      }
    ]
  },
  {
    id: 59,
    name: "Found: Texas Instruments TI-30XIIS Scientific Calculator",
    category: "ELECTRONICS",
    categoryDisplay: "Electronics",
    type: "FOUND",
    location: "Block A - Room 105 Tutorial Hall Desk 4",
    date: "2026-10-26",
    time: "15:40",
    image: "calculator.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Prof. Rajesh Nair",
    description: "Dual-power solar and battery scientific calculator with blue accent housing and grey slide protective case.",
    quiz: [
      {
        q: "What dual-power mechanism does this Texas Instruments calculator use?",
        options: ["Solar panel and internal battery", "Type-C rechargeable lithium cell", "Two AA alkaline batteries", "Solar only without battery backup"],
        correct: 0
      },
      {
        q: "In which classroom was this calculator discovered?",
        options: ["Block A - Room 105 Tutorial Hall", "Civil Surveying Lab", "Engineering Graphics Drawing Studio", "Exam Hall 4"],
        correct: 0
      },
      {
        q: "What protective slide cover accompanies this calculator?",
        options: ["Transparent red case", "Grey slide hard cover with blue accents", "Black leather sleeve", "Silicone gel wrap"],
        correct: 1
      }
    ]
  },
  {
    id: 60,
    name: "Found: Samsung Galaxy M34 5G (Prism Silver)",
    category: "ELECTRONICS",
    categoryDisplay: "Electronics",
    type: "FOUND",
    location: "Main Gate Security Checkpost Desk",
    date: "2026-10-30",
    time: "18:30",
    image: "samsung-phone.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Prof. Rajesh Nair",
    description: "Silver finish Samsung smartphone found on bench, enclosed in a dark navy carbon-texture protective back case.",
    quiz: [
      {
        q: "What protective case is on this found Samsung smartphone?",
        options: ["Clear transparent bumper", "Dark navy carbon-texture protective case", "Red flip leather cover", "Glitter pop-socket case"],
        correct: 1
      },
      {
        q: "At which campus location was this phone handed in?",
        options: ["Main Gate Security Checkpost Desk", "Central Library Circulation Counter", "Gymnasium Reception", "Girls Hostel A Guard Post"],
        correct: 0
      },
      {
        q: "What cellular network carrier is shown on the active SIM?",
        options: ["Airtel", "Jio 5G", "Vodafone Idea", "BSNL Mobile"],
        correct: 1
      }
    ]
  },
  {
    id: 61,
    name: "Found: OnePlus Nord Buds 2 True Wireless Earbuds in White Case",
    category: "ELECTRONICS",
    categoryDisplay: "Electronics",
    type: "FOUND",
    location: "Block B - Computer Laboratory 4 Desk 22",
    date: "2026-10-29",
    time: "12:10",
    image: "airpods-case.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Pill-shaped glossy white charging case containing both left and right in-ear buds with basswave technology.",
    quiz: [
      {
        q: "What shape and color is the charging case of these OnePlus earbuds?",
        options: ["Square matte black case", "Pill-shaped glossy white case with red 1+ emblem", "Round silver metal pebble case", "Oval green silicone case"],
        correct: 1
      },
      {
        q: "In which laboratory desk was this case found?",
        options: ["Computer Laboratory 4 Desk 22", "Physics Optics Lab Counter 3", "Chemistry Analytical Room 1", "Digital Library Station 9"],
        correct: 0
      },
      {
        q: "Are both left and right earbuds present inside the case?",
        options: ["Yes, both left and right buds are present inside", "No, only the left earbud is inside", "No, case was found empty", "No, only the right earbud is inside"],
        correct: 0
      }
    ]
  },
  {
    id: 62,
    name: "Found: Dell 65W Original Barrel-Pin Laptop Power Adapter",
    category: "ELECTRONICS",
    categoryDisplay: "Electronics",
    type: "FOUND",
    location: "Seminar Hall 2 - Sound Control Console Desk",
    date: "2026-10-27",
    time: "16:30",
    image: "laptop-charger.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Prof. Rajesh Nair",
    description: "Dell 4.5mm round small-pin charging adapter with illuminated blue LED power ring on the jack.",
    quiz: [
      {
        q: "What special indicator light is on the barrel charging jack of this Dell charger?",
        options: ["Red blinking charging light", "Illuminated blue LED power ring", "Solid green dot LED", "No light indicator"],
        correct: 1
      },
      {
        q: "In which hall was this charger discovered?",
        options: ["Seminar Hall 2 - Sound Control Console Desk", "Physics Lecture Hall 101", "Auditorium Green Room", "Exam Hall 4"],
        correct: 0
      },
      {
        q: "What power wattage rating is specified on the adapter brick?",
        options: ["45W", "65W", "90W", "130W"],
        correct: 1
      }
    ]
  },
  {
    id: 63,
    name: "Found: Concrete Technology & Soil Mechanics Lab Manual",
    category: "DOCUMENTS",
    categoryDisplay: "Documents",
    type: "FOUND",
    location: "Civil Engineering Concrete Testing Laboratory",
    date: "2026-10-28",
    time: "15:00",
    image: "lab-record-file.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Prof. Rajesh Nair",
    description: "Thick brown hardbound laboratory experiment notebook with University gold seal and certified observation charts.",
    quiz: [
      {
        q: "What color is the binding of this Civil Engineering record manual?",
        options: ["Spiral-bound blue plastic", "Thick brown hardbound notebook with gold seal", "Red paper folder with brass clips", "Green cardboard folder"],
        correct: 1
      },
      {
        q: "What student name appears on the certificate sheet?",
        options: ["Aarav Sharma", "Vikram Verma", "Rohan K.", "Priya S."],
        correct: 1
      },
      {
        q: "Which department laboratory was this manual found in?",
        options: ["Civil Engineering Concrete Testing Laboratory", "Machine Tools Workshop", "Chemistry Analytical Lab", "CAD/CAM Computer Center"],
        correct: 0
      }
    ]
  },
  {
    id: 64,
    name: "Found: Fastrack Reflex Beat+ Fitness Smart Band (Charcoal Black)",
    category: "ELECTRONICS",
    categoryDisplay: "Electronics",
    type: "FOUND",
    location: "Basketball Court - Official Scorekeeper Table",
    date: "2026-10-29",
    time: "17:30",
    image: "smart-watch.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Slim activity tracker with curved rectangular colour display and textured charcoal black silicone wristband.",
    quiz: [
      {
        q: "What brand manufactured this found fitness smart band?",
        options: ["Noise", "Fastrack", "boAt", "Fire-Boltt"],
        correct: 1
      },
      {
        q: "Where on the basketball court was this smart band located?",
        options: ["Underneath the south hoop", "Official Scorekeeper Table", "West stand bleachers", "Player bench drink cooler"],
        correct: 1
      },
      {
        q: "What color and texture is the band strap?",
        options: ["Smooth neon orange", "Textured charcoal black silicone", "Braided grey nylon", "Stainless steel mesh"],
        correct: 1
      }
    ]
  },
  {
    id: 65,
    name: "Found: Titan Eyeplus Round Metal Frame Anti-Glare Glasses",
    category: "ACCESSORIES",
    categoryDisplay: "Accessories",
    type: "FOUND",
    location: "Central Library - Group Discussion Room 2",
    date: "2026-10-28",
    time: "14:50",
    image: "reading-glasses.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Prof. Rajesh Nair",
    description: "Vintage circular golden-bronze metal spectacle frames with clear blue-filter anti-glare lenses.",
    quiz: [
      {
        q: "What shape and finish are the metal frames of these spectacles?",
        options: ["Rectangular matte black acetate", "Vintage circular golden-bronze metal frames", "Square silver wire frames", "Hexagonal rose gold frames"],
        correct: 1
      },
      {
        q: "What storage case accompanies these glasses?",
        options: ["Magnetic grey felt hard case with Titan Eyeplus logo", "Leather zipper triangular pouch", "Clear plastic snap box", "Blue fabric drawstring bag"],
        correct: 0
      },
      {
        q: "In which Central Library area were these glasses found?",
        options: ["Circulation desk", "Group Discussion Room 2", "Newspaper reading area", "Silent Zone desk 18"],
        correct: 1
      }
    ]
  },
  {
    id: 66,
    name: "Found: HP v236w 64GB Metal USB Flash Drive",
    category: "ELECTRONICS",
    categoryDisplay: "Electronics",
    type: "FOUND",
    location: "Block C - Main Server Room Console Desk",
    date: "2026-10-30",
    time: "11:20",
    image: "usb-flash-drive.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Prof. Rajesh Nair",
    description: "Seamless zinc alloy metal USB 2.0 thumb drive with built-in key ring strap slot.",
    quiz: [
      {
        q: "What material is the body casing of this HP flash drive?",
        options: ["Black rubberized plastic", "Zinc alloy metal with key loop", "Blue transparent acrylic", "White swivel plastic"],
        correct: 1
      },
      {
        q: "What is the storage capacity of this HP flash drive?",
        options: ["16GB", "32GB", "64GB", "128GB"],
        correct: 2
      },
      {
        q: "Where was this USB drive discovered on campus?",
        options: ["Block C - Main Server Room Console Desk", "Digital Library Terminal 7", "CAD/CAM Lab 2 Desk 19", "Mathematics Tutorial Hall"],
        correct: 0
      }
    ]
  },
  {
    id: 67,
    name: "Found: Parker Jotter Stainless Steel Ballpoint Pen in Case",
    category: "OTHER",
    categoryDisplay: "Other",
    type: "FOUND",
    location: "Principal & Dean's Office - Reception Counter",
    date: "2026-10-27",
    time: "11:00",
    image: "parker-pen.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Prof. Rajesh Nair",
    description: "All-steel polished classic ballpoint click pen with iconic high-shine arrow pocket clip.",
    quiz: [
      {
        q: "What finish is this found Parker Jotter pen?",
        options: ["Matte black lacquer", "All-steel polished stainless steel with high-shine arrow clip", "Gold plated brass", "Burgundy plastic barrel"],
        correct: 1
      },
      {
        q: "In which campus office was this pen found?",
        options: ["Principal & Dean's Office Reception Counter", "Exam Branch Office", "Placement Cell Room 2", "Sports Director's Room"],
        correct: 0
      },
      {
        q: "What text is engraved on the barrel of this pen?",
        options: ["'Batch of 2024'", "'Alumni Association'", "'Excellence in Engineering'", "'University Topper'"],
        correct: 0
      }
    ]
  },
  {
    id: 68,
    name: "Found: Milton Thermosteel Sporty 600ml Matte Red Flask",
    category: "ACCESSORIES",
    categoryDisplay: "Accessories",
    type: "FOUND",
    location: "Indoor Badminton Court 1 - Side Equipment Bench",
    date: "2026-10-29",
    time: "19:00",
    image: "sipper-bottle.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Aarav Sharma",
    description: "Vacuum insulated crimson red double-walled stainless flask with convenient one-touch click drinking straw.",
    quiz: [
      {
        q: "What color is this Milton Thermosteel Sporty flask?",
        options: ["Silver metallic", "Matte Crimson Red", "Sky Blue", "Forest Green"],
        correct: 1
      },
      {
        q: "What drinking mechanism is on the lid of this flask?",
        options: ["Twist screw cap", "One-touch click pop-up drinking straw", "Wide open spout", "Push-button pour stopper"],
        correct: 1
      },
      {
        q: "Where was this flask left behind?",
        options: ["Indoor Badminton Court 1 Side Equipment Bench", "Basketball court bleachers", "Main Canteen fruit juice stall", "Hostel 1 common lounge"],
        correct: 0
      }
    ]
  },
  {
    id: 69,
    name: "Found: Black Large Windproof Umbrella with Wooden Curved Handle",
    category: "ACCESSORIES",
    categoryDisplay: "Accessories",
    type: "FOUND",
    location: "Main Campus Library - Ground Floor Umbrella Stand",
    date: "2026-10-30",
    time: "17:10",
    image: "umbrella-blue.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Prof. Rajesh Nair",
    description: "Full-size sturdy black walking umbrella featuring a classic dark wooden J-handle and gold-tone tip.",
    quiz: [
      {
        q: "What style handle does this black full-size umbrella have?",
        options: ["Straight foam grip handle", "Classic dark wooden J-shaped curved handle", "Rubber pistol grip handle", "Flat fold pocket knob"],
        correct: 1
      },
      {
        q: "How many reinforced spokes support the umbrella canopy?",
        options: ["8 spokes", "16 reinforced fiberglass spokes", "10 aluminum spokes", "12 steel spokes"],
        correct: 1
      },
      {
        q: "Where in the campus library was this umbrella left?",
        options: ["Circulation return desk", "Ground Floor Umbrella Stand by Entry", "1st floor study cubicle", "Group discussion room"],
        correct: 1
      }
    ]
  },
  {
    id: 70,
    name: "Found: Suzuki Access 125 Scooter Key with Blue Cartoon Lanyard",
    category: "KEYS",
    categoryDisplay: "Keys",
    type: "FOUND",
    location: "Girls Hostel A - Main Security Guard Counter",
    date: "2026-10-29",
    time: "21:15",
    image: "dorm-keys.jpg",
    status: "ACTIVE",
    isDemo: true,
    reportedBy: "Prof. Rajesh Nair",
    description: "Single Suzuki scooter ignition key with safety magnet head on a blue polyester fabric neck strap.",
    quiz: [
      {
        q: "What cartoon character lanyard is attached to this Suzuki scooter key?",
        options: ["Spider-Man", "Doraemon blue fabric neck strap", "Minion yellow charm", "Pokemon Pikachu ribbon"],
        correct: 1
      },
      {
        q: "What metal charm is on the split ring alongside the key?",
        options: ["Small metallic bell", "Miniature brass wrench", "Silver lucky coin", "Plastic whistle"],
        correct: 0
      },
      {
        q: "At which hostel security counter was this key turned in?",
        options: ["Boys Hostel 1", "Girls Hostel A - Main Security Guard Counter", "Boys Hostel 2", "Girls Hostel B"],
        correct: 1
      }
    ]
  }
];

if (typeof window !== 'undefined') {
  window.CAMPUS_ITEMS = CAMPUS_ITEMS;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CAMPUS_ITEMS;
}

