import { useState } from "react";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, ArrowLeft, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function OpportunityDetail() {
  const [, params] = useRoute("/opportunity/:id");
  const [coverLetter, setCoverLetter] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const opportunityId = params?.id ? parseInt(params.id) : null;

  const { data: opportunity, isLoading } = trpc.opportunity.getById.useQuery(
    { id: opportunityId! },
    { enabled: !!opportunityId }
  );

  const applyMutation = trpc.application.create.useMutation({
    onSuccess: () => {
      toast.success("Candidatura enviada com sucesso!");
      setCoverLetter("");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao enviar candidatura");
    },
  });

  const handleApply = async () => {
    if (!opportunityId) return;
    setIsApplying(true);
    try {
      await applyMutation.mutateAsync({
        opportunityId,
        coverLetter: coverLetter || undefined,
      });
    } finally {
      setIsApplying(false);
    }
  };

  if (!opportunityId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Oportunidade não encontrada.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Oportunidade não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/opportunities">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </Link>
          <Link href="/">
            <h1 className="text-2xl font-bold text-indigo-600 cursor-pointer">ITLink</h1>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Details */}
          <div className="lg:col-span-2">
            {opportunity.image && (
              <img
                src={opportunity.image}
                alt={opportunity.title}
                className="w-full h-80 object-cover rounded-lg mb-6"
              />
            )}

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <CardTitle className="text-3xl mb-2">{opportunity.title}</CardTitle>
                    <CardDescription className="text-base">
                      {opportunity.description}
                    </CardDescription>
                  </div>
                  {opportunity.category && (
                    <Badge variant="secondary">{opportunity.category}</Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-sm text-gray-600">Localização</p>
                      <p className="font-semibold">{opportunity.location}</p>
                    </div>
                  </div>
                  {opportunity.startDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="text-sm text-gray-600">Data de Início</p>
                        <p className="font-semibold">
                          {new Date(opportunity.startDate).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  )}
                  {opportunity.volunteersNeeded && (
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="text-sm text-gray-600">Voluntários Necessários</p>
                        <p className="font-semibold">{opportunity.volunteersNeeded}</p>
                      </div>
                    </div>
                  )}
                  {opportunity.endDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="text-sm text-gray-600">Data de Término</p>
                        <p className="font-semibold">
                          {new Date(opportunity.endDate).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Skills Required */}
                {opportunity.skillsRequired && (
                  <div>
                    <h3 className="font-semibold mb-2">Habilidades Necessárias</h3>
                    <div className="flex flex-wrap gap-2">
                      {JSON.parse(opportunity.skillsRequired || "[]").map(
                        (skill: string, idx: number) => (
                          <Badge key={idx} variant="outline">
                            {skill}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Candidatar-se</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isAuthenticated ? (
                  <>
                    <Textarea
                      placeholder="Conte-nos por que você gostaria de participar desta oportunidade..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="min-h-32"
                    />
                    <Button
                      onClick={handleApply}
                      disabled={isApplying || applyMutation.isPending}
                      className="w-full"
                    >
                      {isApplying || applyMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        "Enviar Candidatura"
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-sm text-gray-600">
                      Você precisa estar logado para se candidatar.
                    </p>
                    <Link href="/">
                      <Button className="w-full">Fazer Login</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
