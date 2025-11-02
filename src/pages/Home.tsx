import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Briefcase, ArrowRight } from "lucide-react";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {APP_LOGO && <img src={APP_LOGO} alt="ITLink" className="h-8 w-8" />}
            <h1 className="text-2xl font-bold text-indigo-600">{APP_TITLE}</h1>
          </div>
          <nav className="flex gap-4 items-center">
            {isAuthenticated ? (
              <>
                <Link href="/opportunities">
                  <Button variant="ghost">Oportunidades</Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="default">Dashboard</Button>
                </Link>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button variant="default">Entrar</Button>
              </a>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 container max-w-6xl mx-auto px-4 py-16 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Conecte-se para <span className="text-indigo-600">Fazer a Diferença</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              ITLink conecta voluntários apaixonados com oportunidades significativas de impacto social. 
              Encontre a causa que faz sentido para você em <strong>itlink.com</strong> e comece a contribuir hoje.
            </p>
            <div className="flex gap-4">
              {isAuthenticated ? (
                <Link href="/opportunities">
                  <Button size="lg" className="gap-2">
                    Explorar Oportunidades <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <a href={getLoginUrl()}>
                  <Button size="lg" className="gap-2">
                    Comece Agora <ArrowRight className="w-5 h-5" />
                  </Button>
                </a>
              )}
              <Button size="lg" variant="outline">
                Saiba Mais
              </Button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 p-4 rounded-lg">
                  <Users className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Milhares de Voluntários</h3>
                  <p className="text-gray-600">Junte-se a uma comunidade global</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-4 rounded-lg">
                  <Briefcase className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Centenas de Oportunidades</h3>
                  <p className="text-gray-600">Escolha a causa que te inspira</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-4 rounded-lg">
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Impacto Real</h3>
                  <p className="text-gray-600">Transforme vidas e comunidades</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center">1</span>
                  Crie seu Perfil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Registre-se como voluntário ou organização e complete seu perfil com suas informações e interesses.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center">2</span>
                  Explore Oportunidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Navegue por centenas de oportunidades de voluntariado e encontre aquelas que combinam com você.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center">3</span>
                  Comece a Contribuir
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Candidate-se às oportunidades e comece a fazer a diferença em sua comunidade.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para Fazer a Diferença?</h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de voluntários que estão transformando comunidades.
          </p>
          {isAuthenticated ? (
            <Link href="/opportunities">
              <Button size="lg" variant="secondary">
                Explorar Oportunidades Agora
              </Button>
            </Link>
          ) : (
            <a href={getLoginUrl()}>
              <Button size="lg" variant="secondary">
                Comece Sua Jornada
              </Button>
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container max-w-6xl mx-auto px-4 text-center">
            <p>&copy; 2024 ITLink. Conectando voluntários com oportunidades de impacto.</p>
        </div>
      </footer>
    </div>
  );
}
