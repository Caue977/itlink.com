import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, Search, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Opportunities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: opportunities, isLoading } = trpc.opportunity.listActive.useQuery();

  const categories = ["Educação", "Saúde", "Meio Ambiente", "Assistência Social", "Tecnologia"];

  const filtered = opportunities?.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || opp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-indigo-600 cursor-pointer">ITLink</h1>
          </Link>
          <nav className="flex gap-4">
            <Link href="/opportunities">
              <Button variant="ghost">Oportunidades</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="default">Dashboard</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Oportunidades de Voluntariado</h1>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar oportunidades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              size="sm"
            >
              Todas
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                size="sm"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Opportunities List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600 text-lg">Nenhuma oportunidade encontrada.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((opportunity) => (
              <Link key={opportunity.id} href={`/opportunity/${opportunity.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  {opportunity.image && (
                    <img
                      src={opportunity.image}
                      alt={opportunity.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="line-clamp-2">{opportunity.title}</CardTitle>
                      {opportunity.category && (
                        <Badge variant="secondary" className="whitespace-nowrap">
                          {opportunity.category}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {opportunity.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {opportunity.location}
                    </div>
                    {opportunity.startDate && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(opportunity.startDate).toLocaleDateString("pt-BR")}
                      </div>
                    )}
                    {opportunity.volunteersNeeded && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        {opportunity.volunteersNeeded} voluntários necessários
                      </div>
                    )}
                    <Button className="w-full mt-4" size="sm">
                      Ver Detalhes
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
