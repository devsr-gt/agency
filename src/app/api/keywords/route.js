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
    local: [
      { keyword: "criminal defense attorney [city]", volume: "varies", difficulty: 45 },
      { keyword: "drug charges lawyer [city]", volume: "varies", difficulty: 50 },
      { keyword: "dui lawyer [city]", volume: "varies", difficulty: 40 },
      { keyword: "best criminal lawyer [city]", volume: "varies", difficulty: 43 }
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