// Initial comprehensive realistic seed data for Bike Showroom Management System
const initialData = {
  users: [
    {
      id: "usr-1",
      name: "Suresh Kumar",
      email: "owner@velocebikes.com",
      role: "admin",
      phone: "+91 98401 23456",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: "usr-2",
      name: "Karthik Raja",
      email: "karthik@velocebikes.com",
      role: "staff",
      phone: "+91 98402 34567",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: "usr-3",
      name: "Anand Natarajan",
      email: "anand.customer@gmail.com",
      role: "customer",
      phone: "+91 98403 45678",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
    }
  ],
  bikes: [
    {
      id: "bk-1",
      stock_id: "VB-2023-01",
      brand: "Yamaha",
      model: "FZ-S V3 ABS",
      variant: "Deluxe Bluetooth",
      year: 2021,
      reg_year: 2021,
      reg_number: "TN 09 BX 4589",
      km_driven: 14500,
      fuel_type: "Petrol",
      engine_cc: 149,
      mileage: "48 km/l",
      color: "Matte Blue",
      owner_count: 1,
      insurance_status: "Active (Comprehensive)",
      insurance_expiry: "2026-11-20",
      rc_status: "Original Available",
      bike_condition: "Excellent",
      purchase_price: 72000,
      expected_price: 88000,
      selling_price: 88000,
      status: "available", // available | reserved | sold
      photos: [
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80", // 1. Front Look
        "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80", // 2. Front Tyre (Compulsory)
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80", // 3. Back Tyre (Compulsory)
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"  // 4. Back Look
      ],
      description: "Pristine single-owner Yamaha FZ-S V3. Full showroom service history with zero accident records. New rear tyre fitted.",
      created_at: "2026-08-10"
    },
    {
      id: "bk-2",
      stock_id: "VB-2023-02",
      brand: "Royal Enfield",
      model: "Classic 350",
      variant: "Dark Stealth Black Dual ABS",
      year: 2020,
      reg_year: 2020,
      reg_number: "TN 07 CW 7721",
      km_driven: 21000,
      fuel_type: "Petrol",
      engine_cc: 349,
      mileage: "35 km/l",
      color: "Stealth Black",
      owner_count: 1,
      insurance_status: "Active (Third Party)",
      insurance_expiry: "2026-10-15",
      rc_status: "Original Available",
      bike_condition: "Very Good",
      purchase_price: 122000,
      expected_price: 145000,
      selling_price: 145000,
      status: "available",
      photos: [
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80", // 1. Front Look
        "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80", // 2. Front Tyre (Compulsory)
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80", // 3. Back Tyre (Compulsory)
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"  // 4. Back Look
      ],
      description: "Timeless Classic 350 in Stealth Black matte finish. Alloy wheels with tubeless tyres. Smooth thump, clean engine.",
      created_at: "2026-08-15"
    },
    {
      id: "bk-3",
      stock_id: "VB-2023-03",
      brand: "KTM",
      model: "Duke 200",
      variant: "BS6 Dual Channel ABS",
      year: 2022,
      reg_year: 2022,
      reg_number: "TN 10 DK 9021",
      km_driven: 9800,
      fuel_type: "Petrol",
      engine_cc: 199,
      mileage: "32 km/l",
      color: "Electronic Orange",
      owner_count: 1,
      insurance_status: "Active (Comprehensive)",
      insurance_expiry: "2027-03-30",
      rc_status: "Original Available",
      bike_condition: "Top Notch",
      purchase_price: 140000,
      expected_price: 165000,
      selling_price: 165000,
      status: "available",
      photos: [
        "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80", // 1. Front Look
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80", // 2. Front Tyre (Compulsory)
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80", // 3. Back Tyre (Compulsory)
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"  // 4. Back Look
      ],
      description: "Low km, track-inspired streetfighter. Fresh chain sprocket, WP Apex suspension, aggressive styling.",
      created_at: "2026-08-20"
    },
    {
      id: "bk-4",
      stock_id: "VB-2023-04",
      brand: "Honda",
      model: "Activa 6G",
      variant: "DLX H-Smart",
      year: 2022,
      reg_year: 2022,
      reg_number: "TN 02 AY 3314",
      km_driven: 11200,
      fuel_type: "Petrol",
      engine_cc: 109,
      mileage: "55 km/l",
      color: "Pearl Siren Blue",
      owner_count: 1,
      insurance_status: "Active (Comprehensive)",
      insurance_expiry: "2027-01-12",
      rc_status: "Original Available",
      bike_condition: "Like New",
      purchase_price: 54000,
      expected_price: 68000,
      selling_price: 68000,
      status: "available",
      photos: [
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80", // 1. Front Look
        "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80", // 2. Front Tyre (Compulsory)
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80", // 3. Back Tyre (Compulsory)
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"  // 4. Back Look
      ],
      description: "Smart key edition Honda Activa 6G. Ideal for daily city commute. High fuel efficiency of 52+ km/l.",
      created_at: "2026-08-22"
    },
    {
      id: "bk-5",
      stock_id: "VB-2023-05",
      brand: "TVS",
      model: "Apache RTR 160 4V",
      variant: "Special Edition SmartXonnect",
      year: 2021,
      reg_year: 2021,
      reg_number: "TN 14 EV 5812",
      km_driven: 17300,
      fuel_type: "Petrol",
      engine_cc: 159,
      mileage: "46 km/l",
      color: "Matte Black & Red",
      owner_count: 1,
      insurance_status: "Active",
      insurance_expiry: "2026-09-28",
      rc_status: "Original Available",
      bike_condition: "Excellent",
      purchase_price: 76000,
      expected_price: 92000,
      selling_price: 92000,
      status: "available",
      photos: [
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80", // 1. Front Look
        "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80", // 2. Front Tyre (Compulsory)
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80", // 3. Back Tyre (Compulsory)
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80"  // 4. Back Look
      ],
      description: "Segment best riding modes: Urban, Rain, Sport. Bluetooth navigation console, adjustable levers.",
      created_at: "2026-08-25"
    },
    {
      id: "bk-6",
      stock_id: "VB-2023-06",
      brand: "Bajaj",
      model: "Pulsar NS200",
      variant: "Dual Channel ABS FI",
      year: 2019,
      reg_year: 2019,
      reg_number: "TN 22 BR 1190",
      km_driven: 28000,
      fuel_type: "Petrol",
      engine_cc: 199,
      mileage: "36 km/l",
      color: "Pewter Grey",
      owner_count: 2,
      insurance_status: "Expired - Showroom Renewing",
      insurance_expiry: "2026-07-01",
      rc_status: "Original Available",
      bike_condition: "Good",
      purchase_price: 66000,
      expected_price: 82000,
      selling_price: 82000,
      status: "reserved",
      photos: [
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80", // 1. Front Look
        "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80", // 2. Front Tyre (Compulsory)
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80", // 3. Back Tyre (Compulsory)
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"  // 4. Back Look
      ],
      description: "Triple spark liquid-cooled engine. Reserved for customer Murugan with token advance.",
      created_at: "2026-08-28"
    },
    {
      id: "bk-7",
      stock_id: "VB-2023-07",
      brand: "Suzuki",
      model: "Access 125",
      variant: "Ride Connect Edition Special",
      year: 2021,
      reg_year: 2021,
      reg_number: "TN 05 AZ 8841",
      km_driven: 13000,
      fuel_type: "Petrol",
      engine_cc: 124,
      mileage: "52 km/l",
      color: "Metallic Matte Platinum",
      owner_count: 1,
      insurance_status: "Active",
      insurance_expiry: "2026-12-10",
      rc_status: "Transferred to New Owner",
      bike_condition: "Excellent",
      purchase_price: 51000,
      expected_price: 65000,
      selling_price: 64000,
      status: "sold",
      photos: [
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80", // 1. Front Look
        "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80", // 2. Front Tyre (Compulsory)
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80", // 3. Back Tyre (Compulsory)
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"  // 4. Back Look
      ],
      description: "Sold to Mr. Rajesh Kumar on 05-Sep-2026. Delivered with RC transfer acknowledgment.",
      created_at: "2026-08-05"
    }
  ],
  inspections: [
    {
      id: "insp-1",
      bike_id: "bk-1",
      engine: "Good",
      battery: "Good",
      tyres: "Good",
      brake: "Good",
      suspension: "Good",
      clutch: "Good",
      gearbox: "Good",
      electrical: "Good",
      lights: "Good",
      body: "Good",
      paint: "Average",
      accident_history: "None (Clean Record)",
      service_history: "Showroom Verified",
      overall_score: 95,
      status: "Passed", // Passed | Failed
      notes: "Clean engine compression. Minor surface hairline scuff on front mudguard polished out.",
      inspected_by: "Karthik Raja (Chief Mechanic & Lead Sales)",
      inspected_date: "2026-08-11"
    },
    {
      id: "insp-2",
      bike_id: "bk-2",
      engine: "Good",
      battery: "Good",
      tyres: "Good",
      brake: "Good",
      suspension: "Good",
      clutch: "Good",
      gearbox: "Good",
      electrical: "Good",
      lights: "Good",
      body: "Good",
      paint: "Good",
      accident_history: "None",
      service_history: "Royal Enfield Authorized Service Verified",
      overall_score: 98,
      status: "Passed",
      notes: "Original exhaust sound. Tappet clear, oil level full, brake pads 80% life.",
      inspected_by: "Karthik Raja",
      inspected_date: "2026-08-16"
    },
    {
      id: "insp-3",
      bike_id: "bk-3",
      engine: "Good",
      battery: "Good",
      tyres: "Average",
      brake: "Good",
      suspension: "Good",
      clutch: "Good",
      gearbox: "Good",
      electrical: "Good",
      lights: "Good",
      body: "Good",
      paint: "Good",
      accident_history: "None",
      service_history: "KTM Care Service Records Verified",
      overall_score: 92,
      status: "Passed",
      notes: "Front tyre has 50% thread remaining. Rear tyre good. Quick acceleration, radiator fan functional.",
      inspected_by: "Karthik Raja",
      inspected_date: "2026-08-21"
    }
  ],
  purchases: [
    {
      id: "pur-1",
      bike_id: "bk-1",
      seller_name: "Vigneshwaran S",
      seller_phone: "+91 97910 11223",
      seller_address: "No. 42, 2nd Main Road, T. Nagar, Chennai",
      seller_id_proof: "Aadhaar XXXX-XXXX-4512",
      purchase_price: 72000,
      payment_mode: "Bank Transfer (NEFT)",
      purchase_date: "2026-08-10",
      notes: "Seller moving abroad. Form 29 & 30 signed, duplicate key and user manual handed over."
    },
    {
      id: "pur-2",
      bike_id: "bk-2",
      seller_name: "Balamurugan K",
      seller_phone: "+91 98410 99887",
      seller_address: "Plot 18, Annanagar West, Chennai",
      seller_id_proof: "Aadhaar XXXX-XXXX-8971",
      purchase_price: 122000,
      payment_mode: "IMPS Transfer",
      purchase_date: "2026-08-15",
      notes: "Full cash settlement cleared. Seller provided noc from financier."
    }
  ],
  customers: [
    {
      id: "cust-1",
      name: "Dinesh Kumar",
      phone: "+91 98404 12345",
      email: "dinesh.k@outlook.com",
      address: "Velachery, Chennai",
      budget: 90000,
      interested_brand: "Yamaha",
      interested_model: "FZ-S",
      created_at: "2026-09-01"
    },
    {
      id: "cust-2",
      name: "Murugan Selvam",
      phone: "+91 98405 23456",
      email: "murugan.s@gmail.com",
      address: "Tambaram, Chennai",
      budget: 85000,
      interested_brand: "Bajaj",
      interested_model: "Pulsar NS200",
      created_at: "2026-09-03"
    },
    {
      id: "cust-3",
      name: "Praveen Raj",
      phone: "+91 98406 34567",
      email: "praveen.raj@yahoo.com",
      address: "Porur, Chennai",
      budget: 150000,
      interested_brand: "Royal Enfield",
      interested_model: "Classic 350",
      created_at: "2026-09-06"
    }
  ],
  enquiries: [
    {
      id: "enq-1",
      customer_id: "cust-1",
      customer_name: "Dinesh Kumar",
      phone: "+91 98404 12345",
      bike_id: "bk-1",
      bike_title: "Yamaha FZ-S V3 ABS",
      stage: "test_ride", // new | contacted | interested | test_ride | negotiation | booking | sold | lost
      budget: 90000,
      source: "Walk-in Showroom",
      assigned_to: "Karthik Raja",
      follow_up_date: "2026-09-18",
      notes: "Customer came with family. Liked matte blue color. Test ride scheduled for tomorrow 11:30 AM."
    },
    {
      id: "enq-2",
      customer_id: "cust-2",
      customer_name: "Murugan Selvam",
      phone: "+91 98405 23456",
      bike_id: "bk-6",
      bike_title: "Bajaj Pulsar NS200",
      stage: "booking",
      budget: 85000,
      source: "Website Online Enquiry",
      assigned_to: "Karthik Raja",
      follow_up_date: "2026-09-20",
      notes: "Customer paid ₹5,000 token advance. Delivery scheduled after festive weekend."
    },
    {
      id: "enq-3",
      customer_id: "cust-3",
      customer_name: "Praveen Raj",
      phone: "+91 98406 34567",
      bike_id: "bk-2",
      bike_title: "Royal Enfield Classic 350",
      stage: "interested",
      budget: 150000,
      source: "Instagram Lead",
      assigned_to: "Karthik Raja",
      follow_up_date: "2026-09-19",
      notes: "Wants single-owner bullet with stealth finish. Sent video walk-around."
    }
  ],
  test_rides: [
    {
      id: "tr-1",
      customer_name: "Dinesh Kumar",
      customer_phone: "+91 98404 12345",
      bike_id: "bk-1",
      bike_title: "Yamaha FZ-S V3 ABS",
      scheduled_date: "2026-09-18",
      scheduled_time: "11:30 AM",
      staff_name: "Karthik Raja",
      status: "scheduled", // requested | scheduled | completed | cancelled
      feedback: "Pending test ride"
    },
    {
      id: "tr-2",
      customer_name: "Murugan Selvam",
      customer_phone: "+91 98405 23456",
      bike_id: "bk-6",
      bike_title: "Bajaj Pulsar NS200",
      scheduled_date: "2026-09-04",
      scheduled_time: "04:00 PM",
      staff_name: "Karthik Raja",
      status: "completed",
      feedback: "Customer very satisfied with acceleration and disc brake bite. Decided to book immediately."
    }
  ],
  bookings: [
    {
      id: "bkg-1",
      booking_number: "BKG-2026-008",
      bike_id: "bk-6",
      bike_title: "Bajaj Pulsar NS200 (TN 22 BR 1190)",
      customer_name: "Murugan Selvam",
      customer_phone: "+91 98405 23456",
      booking_amount: 5000,
      agreed_price: 82000,
      pending_amount: 77000,
      booking_date: "2026-09-04",
      expected_delivery: "2026-09-22",
      payment_mode: "Google Pay (UPI)",
      status: "active" // active | completed | cancelled
    }
  ],
  sales: [
    {
      id: "sale-1",
      invoice_number: "INV-2026-0901",
      bike_id: "bk-7",
      bike_title: "Suzuki Access 125 (TN 05 AZ 8841)",
      customer_name: "Rajesh Kumar",
      customer_phone: "+91 98408 55443",
      customer_address: "Mylapore, Chennai",
      vehicle_price: 64000,
      discount: 1000,
      rto_transfer_charges: 1500,
      insurance_charges: 0,
      total_amount: 64500,
      paid_amount: 64500,
      payment_mode: "UPI + Cash",
      sale_date: "2026-09-05",
      delivery_date: "2026-09-05",
      delivery_status: "Delivered",
      documents_handed: ["Original RC", "Sale Agreement", "Insurance Policy", "Keys x2"]
    }
  ],
  expenses: [
    {
      id: "exp-1",
      bike_id: "bk-1",
      expense_type: "service", // service | repair | transport | detailing | documentation
      amount: 2200,
      description: "Engine oil change (Motul 7100), air filter cleaning, spark plug check",
      expense_date: "2026-08-11"
    },
    {
      id: "exp-2",
      bike_id: "bk-1",
      expense_type: "detailing",
      amount: 1200,
      description: "Full body foam wash and 3M Teflon polishing",
      expense_date: "2026-08-12"
    },
    {
      id: "exp-3",
      bike_id: "bk-2",
      expense_type: "service",
      amount: 2800,
      description: "RE Castrol semi-synthetic oil, front brake pad replacement, chain lubrication",
      expense_date: "2026-08-16"
    },
    {
      id: "exp-4",
      bike_id: "bk-7",
      expense_type: "service",
      amount: 1800,
      description: "General servicing, battery charging, carburetor tuning",
      expense_date: "2026-08-06"
    },
    {
      id: "exp-5",
      bike_id: "bk-7",
      expense_type: "documentation",
      amount: 800,
      description: "RTO NOC clearance & document stamp duty",
      expense_date: "2026-08-08"
    }
  ]
};

module.exports = initialData;
