import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [userType, setUserType] = useState<"volunteer" | "organization" | null>(null);

  // Volunteer data
  const { data: volunteerProfile } = trpc.volunteer.getProfile.useQuery();
  const { data: volunteerApplications } = trpc.application.getByVolunteer.useQuery();

  // Organization data
  const { data: organizationProfile } = trpc.organization.getProfile.useQuery();
  const { data: organizationOpportunities } = trpc.opportunity.getByOrganization.useQuery();
  const { data: organizationApplications } = trpc.application.getByOpportunity.useQuery();

  // Form states
  const [volunteerBio, setVolunteerBio] = useState("");
  const [volunteerSkills, setVolunteerSkills] = useState("");
  const [volunteerAvailability, setVolunteerAvailability] = useState("");
  const [volunteerLocation, setVolunteerLocation] = useState("");

  const [orgName, setOrgName] = useState("");
  const [orgDescription, setOrgDescription] = useState("");
  const [orgLocation, setOrgLocation] = useState("");
  const [orgWebsite, setOrgWebsite] = useState("");

  // Mutations
  const createVolunteerMutation = trpc.volunteer.createProfile.useMutation({
    onSuccess: () => {
      toast.success("Perfil de voluntário criado!");
      setVolunteerBio("");
      setVolunteerSkills("");
      setVolunteerAvailability("");
      setVolunteerLocation("");
    },
  });

  const createOrgMutation = trpc.organization.createProfile.useMutation({
    onSuccess: () => {
      toast.success("Perfil de organização criado!");
      setOrgName("");
      setOrgDescription("");
      setOrgLocation("");
      setOrgWebsite("");
    },
  });

  const handleCreateVolunteer = async () => {
    await createVolunteerMutation.mutateAsync({
      bio: volunteerBio,
      skills: volunteerSkills,
      availability: volunteerAvailability,
      location: volunteerLocation,
    });
  };

  const handleCreateOrg = async () => {
    await createOrgMutation.mutateAsync({
      organizationName: orgName,
      description: orgDescription,
      location: orgLocation,
      website: orgWebsite,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-indigo-600 cursor-pointer">ITLink</h1>
          </Link>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <Button variant="outline" size="sm" onClick={() => logout()}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 py-8">
        {/* Type Selection */}
        {!userType && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setUserType("volunteer")}>
              <CardHeader>
                <CardTitle>Sou Voluntário</CardTitle>
                <CardDescription>
                  Encontre oportunidades de voluntariado e contribua para causas que importam.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Continuar como Voluntário</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setUserType("organization")}>
              <CardHeader>
                <CardTitle>Sou Organização</CardTitle>
                <CardDescription>
                  Publique oportunidades de voluntariado e encontre voluntários dedicados.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Continuar como Organização</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Volunteer Dashboard */}
        {userType === "volunteer" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Dashboard de Voluntário</h1>
              <Button variant="outline" onClick={() => setUserType(null)}>
                Trocar Tipo
              </Button>
            </div>

            <Tabs defaultValue="profile" className="w-full">
              <TabsList>
                <TabsTrigger value="profile">Meu Perfil</TabsTrigger>
                <TabsTrigger value="applications">Minhas Candidaturas</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-4">
                {volunteerProfile ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Perfil Criado</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Bio</p>
                        <p className="font-semibold">{volunteerProfile.bio || "Não preenchido"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Habilidades</p>
                        <p className="font-semibold">{volunteerProfile.skills || "Não preenchido"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Disponibilidade</p>
                        <p className="font-semibold">{volunteerProfile.availability || "Não preenchido"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Localização</p>
                        <p className="font-semibold">{volunteerProfile.location || "Não preenchido"}</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Criar Perfil de Voluntário</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        placeholder="Conte-nos sobre você..."
                        value={volunteerBio}
                        onChange={(e) => setVolunteerBio(e.target.value)}
                      />
                      <Input
                        placeholder="Suas habilidades (ex: Ensino, Programação, Saúde)"
                        value={volunteerSkills}
                        onChange={(e) => setVolunteerSkills(e.target.value)}
                      />
                      <Input
                        placeholder="Disponibilidade (ex: Finais de semana, Noites)"
                        value={volunteerAvailability}
                        onChange={(e) => setVolunteerAvailability(e.target.value)}
                      />
                      <Input
                        placeholder="Localização"
                        value={volunteerLocation}
                        onChange={(e) => setVolunteerLocation(e.target.value)}
                      />
                      <Button
                        onClick={handleCreateVolunteer}
                        disabled={createVolunteerMutation.isPending}
                        className="w-full"
                      >
                        {createVolunteerMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Criando...
                          </>
                        ) : (
                          "Criar Perfil"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Applications Tab */}
              <TabsContent value="applications" className="space-y-4">
                {volunteerApplications && volunteerApplications.length > 0 ? (
                  <div className="grid gap-4">
                    {volunteerApplications.map((app) => (
                      <Card key={app.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle>Candidatura #{app.id}</CardTitle>
                            <Badge
                              variant={
                                app.status === "accepted"
                                  ? "default"
                                  : app.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {app.status === "pending"
                                ? "Pendente"
                                : app.status === "accepted"
                                ? "Aceita"
                                : app.status === "rejected"
                                ? "Rejeitada"
                                : "Concluída"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600">
                            Candidatada em: {new Date(app.appliedAt).toLocaleDateString("pt-BR")}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <p className="text-gray-600">Você ainda não se candidatou a nenhuma oportunidade.</p>
                      <Link href="/opportunities">
                        <Button className="mt-4">Explorar Oportunidades</Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Organization Dashboard */}
        {userType === "organization" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Dashboard de Organização</h1>
              <Button variant="outline" onClick={() => setUserType(null)}>
                Trocar Tipo
              </Button>
            </div>

            <Tabs defaultValue="profile" className="w-full">
              <TabsList>
                <TabsTrigger value="profile">Perfil da Organização</TabsTrigger>
                <TabsTrigger value="opportunities">Minhas Oportunidades</TabsTrigger>
                <TabsTrigger value="applications">Candidaturas Recebidas</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-4">
                {organizationProfile ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>{organizationProfile.organizationName}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Descrição</p>
                        <p className="font-semibold">{organizationProfile.description || "Não preenchido"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Localização</p>
                        <p className="font-semibold">{organizationProfile.location || "Não preenchido"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Website</p>
                        <p className="font-semibold">{organizationProfile.website || "Não preenchido"}</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Criar Perfil de Organização</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Input
                        placeholder="Nome da Organização"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                      />
                      <Textarea
                        placeholder="Descrição da Organização"
                        value={orgDescription}
                        onChange={(e) => setOrgDescription(e.target.value)}
                      />
                      <Input
                        placeholder="Localização"
                        value={orgLocation}
                        onChange={(e) => setOrgLocation(e.target.value)}
                      />
                      <Input
                        placeholder="Website"
                        value={orgWebsite}
                        onChange={(e) => setOrgWebsite(e.target.value)}
                      />
                      <Button
                        onClick={handleCreateOrg}
                        disabled={createOrgMutation.isPending}
                        className="w-full"
                      >
                        {createOrgMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Criando...
                          </>
                        ) : (
                          "Criar Perfil"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Opportunities Tab */}
              <TabsContent value="opportunities" className="space-y-4">
                {organizationOpportunities && organizationOpportunities.length > 0 ? (
                  <div className="grid gap-4">
                    {organizationOpportunities.map((opp) => (
                      <Card key={opp.id}>
                        <CardHeader>
                          <CardTitle>{opp.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600">{opp.location}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <p className="text-gray-600">Você ainda não publicou nenhuma oportunidade.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Applications Tab */}
              <TabsContent value="applications" className="space-y-4">
                {organizationApplications && organizationApplications.length > 0 ? (
                  <div className="grid gap-4">
                    {organizationApplications.map((app) => (
                      <Card key={app.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle>Candidatura #{app.id}</CardTitle>
                            <Badge variant="secondary">{app.status}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600">
                            Candidatada em: {new Date(app.appliedAt).toLocaleDateString("pt-BR")}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <p className="text-gray-600">Você ainda não recebeu nenhuma candidatura.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  );
}
