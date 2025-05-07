export async function GET(request) {
  // This is a mock API endpoint for keyword research
  // In a real application, this would connect to an actual SEO API
  
  // Sample keywords for law firms specializing in criminal defense and personal injury
  const keywords = {
    criminalDefense: [
      { keyword: "criminal defense attorney", volume: 27100, difficulty: 67 },
      { keyword: "criminal lawyer near me", volume: 18100, difficulty: 62 },
      { keyword: "dui lawyer", volume: 12100, difficulty: 65 },
      { keyword: "drug offense attorney", volume: 5400, difficulty: 54 },
      { keyword: "assault defense lawyer", volume: 4200, difficulty: 51 },
      { keyword: "white collar crime attorney", volume: 3700, difficulty: 58 },
      { keyword: "federal criminal defense", volume: 3200, difficulty: 63 },
      { keyword: "best criminal defense attorney", volume: 2900, difficulty: 70 }
    ],
    personalInjury: [
      { keyword: "personal injury lawyer", volume: 135000, difficulty: 78 },
      { keyword: "car accident attorney", volume: 49500, difficulty: 75 },
      { keyword: "slip and fall lawyer", volume: 18200, difficulty: 67 },
      { keyword: "medical malpractice attorney", volume: 22800, difficulty: 72 },
      { keyword: "workplace injury lawyer", volume: 12400, difficulty: 65 },
      { keyword: "truck accident attorney", volume: 14700, difficulty: 69 },
      { keyword: "wrongful death lawyer", volume: 6800, difficulty: 61 },
      { keyword: "motorcycle accident attorney", volume: 9900, difficulty: 60 }
    ],
    local: [
      { keyword: "criminal defense attorney [city]", volume: "varies", difficulty: 45 },
      { keyword: "personal injury lawyer [city]", volume: "varies", difficulty: 52 },
      { keyword: "dui lawyer [city]", volume: "varies", difficulty: 40 },
      { keyword: "car accident attorney [city]", volume: "varies", difficulty: 48 },
      { keyword: "best criminal lawyer [city]", volume: "varies", difficulty: 43 },
      { keyword: "injury law firm [city]", volume: "varies", difficulty: 46 }
    ]
  };
  
  // You can add logic to filter by query parameters if needed
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');
  
  if (type && keywords[type]) {
    return Response.json(keywords[type]);
  }
  
  return Response.json(keywords);
}