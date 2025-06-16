import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Bus, Calendar, Camera, Heart, Home, MapPin, Mountain, Plane, Sparkles, TrainFront, Users, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

const Index = () => {
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    startDate: "",
    endDate: "",
    travelers: "",
    interests: "",
    travelStyle: "",
    transportType: "",
    accommodationType: "",
    mealPreference: "",
    travelPurpose: ""
  });
  const [isPlanning, setIsPlanning] = useState(false);
  // This state will now hold the entire Markdown string for the trip plan
  const [tripPlanMarkdown, setTripPlanMarkdown] = useState<string>("");
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const handlePlanTrip = async () => {
    if (!formData.source || !formData.destination || !formData.startDate || !formData.endDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in source, destination, and travel dates.",
        variant: "destructive",
      });
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast({
        title: "Invalid Dates",
        description: "❌ End Date must be greater than or equal to Start Date.",
        variant: "destructive",
      });
      return;
    }

    setIsPlanning(true);
    setTripPlanMarkdown(""); // Clear previous plan before fetching a new one

    try {
      const payload = {
        ...formData,
        startDate: formatDate(formData.startDate),
        endDate: formatDate(formData.endDate),
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/plan`,
        payload
      );
      console.log(res)

      // --- CHANGE IS HERE ---
      // If the API directly returns the Markdown string in res.data
      setTripPlanMarkdown(res.data.response || "");
      // --- END CHANGE ---

      toast({
        title: "Trip Planned Successfully!",
        description: "Your AI-powered travel recommendations are ready.",
      });

    } catch (err) {
      console.error("Error planning trip:", err);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPlanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-24 text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              AI Travel Planner
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover incredible destinations across India with AI-powered personalized recommendations tailored just for you.
            </p>
            <div className="flex items-center justify-center gap-6 text-blue-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Plane className="w-5 h-5" />
                <span>Pan-India</span>
              </div>
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                <span>Curated</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-50 to-transparent"></div>
      </div>

      {/* Planning Form */}
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Plan Your Dream Trip
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Tell us about your travel preferences and let AI do the rest
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="source" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  From (Source)
                </Label>
                <Input
                  id="source"
                  placeholder="e.g., Mumbai, Delhi, Bangalore"
                  value={formData.source}
                  onChange={(e) => handleInputChange("source", e.target.value)}
                  className="h-12 border-gray-200 focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  To (Destination)
                </Label>
                <Input
                  id="destination"
                  placeholder="e.g., Goa, Kerala, Rajasthan"
                  value={formData.destination}
                  onChange={(e) => handleInputChange("destination", e.target.value)}
                  className="h-12 border-gray-200 focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  className="h-12 border-gray-200 focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  className="h-12 border-gray-200 focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transportType" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Plane className="w-4 h-4 text-indigo-600" />
                  Transport Type
                </Label>
                <Select value={formData.transportType} onValueChange={(value) => handleInputChange("transportType", value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select transport type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flight">
                      <div className="flex items-center gap-2">
                        <Plane className="w-4 h-4" />
                        Flight
                      </div>
                    </SelectItem>
                    <SelectItem value="train">
                      <div className="flex items-center gap-2">
                        <TrainFront className="w-4 h-4" />
                        Train
                      </div>
                    </SelectItem>
                    <SelectItem value="bus">
                      <div className="flex items-center gap-2">
                        <Bus className="w-4 h-4" />
                        Bus
                      </div>
                    </SelectItem>
                    <SelectItem value="car">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Car/Self Drive
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="travelers" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  Number of Travelers
                </Label>
                <Select value={formData.travelers} onValueChange={(value) => handleInputChange("travelers", value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="How many travelers?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Solo Traveler</SelectItem>
                    <SelectItem value="2">Couple</SelectItem>
                    <SelectItem value="family">Family (3-6)</SelectItem>
                    <SelectItem value="group">Group (7+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accommodationType" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Home className="w-4 h-4 text-emerald-600" />
                  Accommodation Type
                </Label>
                <Select value={formData.accommodationType} onValueChange={(value) => handleInputChange("accommodationType", value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select accommodation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="resort">Resort</SelectItem>
                    <SelectItem value="homestay">Homestay</SelectItem>
                    <SelectItem value="heritage">Heritage Property</SelectItem>
                    <SelectItem value="hostel">Hostel/Budget</SelectItem>
                    <SelectItem value="guesthouse">Guest House</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="travelStyle" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mountain className="w-4 h-4 text-orange-600" />
                  Travel Style
                </Label>
                <Select value={formData.travelStyle} onValueChange={(value) => handleInputChange("travelStyle", value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Your travel style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relaxation">Beach & Relaxation</SelectItem>
                    <SelectItem value="adventure">Adventure & Trekking</SelectItem>
                    <SelectItem value="cultural">Cultural & Heritage</SelectItem>
                    <SelectItem value="spiritual">Spiritual & Pilgrimage</SelectItem>
                    <SelectItem value="wildlife">Wildlife & Nature</SelectItem>
                    <SelectItem value="hill-station">Hill Stations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mealPreference" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-red-600" />
                  Meal Preference
                </Label>
                <Select value={formData.mealPreference} onValueChange={(value) => handleInputChange("mealPreference", value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select meal preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="jain">Jain Food</SelectItem>
                    <SelectItem value="local">Local Cuisine</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="travelPurpose" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-600" />
                  Travel Purpose
                </Label>
                <Select value={formData.travelPurpose} onValueChange={(value) => handleInputChange("travelPurpose", value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="What's the occasion?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leisure">Leisure/Vacation</SelectItem>
                    <SelectItem value="honeymoon">Honeymoon</SelectItem>
                    <SelectItem value="family">Family Trip</SelectItem>
                    <SelectItem value="friends">Friends Outing</SelectItem>
                    <SelectItem value="business">Business + Leisure</SelectItem>
                    <SelectItem value="celebration">Special Celebration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests" className="text-sm font-semibold text-gray-700">
                Special Interests & Preferences
              </Label>
              <Textarea
                id="interests"
                placeholder="Tell us about your interests, dietary restrictions, accessibility needs, preferred activities, or any special requests..."
                value={formData.interests}
                onChange={(e) => handleInputChange("interests", e.target.value)}
                className="min-h-[100px] border-gray-200 focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            <Button
              onClick={handlePlanTrip}
              disabled={isPlanning}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isPlanning ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  AI is planning your trip...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5" />
                  Plan My Trip with AI
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations - Displaying the single Markdown string */}
      {tripPlanMarkdown && (
        <div className="container mx-auto px-4 pb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Your AI-Curated Trip Plan
            </h2>
            <p className="text-xl text-gray-600">
              Personalized itinerary based on your preferences
            </p>
          </div>

          <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm p-8">
            <div className="prose max-w-none text-gray-800">
              <ReactMarkdown
                components={{
                  // Custom rendering for Markdown elements to apply Tailwind styles
                  h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-8 mb-3 border-b pb-2" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-6 mb-2" {...props} />,
                  h4: ({ node, ...props }) => <h4 className="text-lg font-bold mt-4 mb-1" {...props} />,
                  p: ({ node, ...props }) => <p className="mb-2 leading-relaxed" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 pl-4" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 pl-4" {...props} />,
                  li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                  strong: ({ node, ...props }) => <strong className="font-semibold text-blue-700" {...props} />,
                  em: ({ node, ...props }) => <em className="italic text-gray-600" {...props} />,
                  a: ({ node, ...props }) => <a className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                  // Add more components as needed for other Markdown elements (e.g., table, img, code)
                }}
              >
                {tripPlanMarkdown}
              </ReactMarkdown>
            </div>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready for your next adventure?</h3>
          <p className="text-gray-300 mb-6">
            Discover the incredible diversity of India with AI-powered travel planning
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
            <span>© 2024 AI Travel Planner</span>
            <span>•</span>
            <span>Powered by Advanced AI</span>
            <span>•</span>
            <span>Explore Incredible India</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;