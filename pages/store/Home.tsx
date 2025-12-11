import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Leaf, 
  Droplets, 
  Sun, 
  Truck, 
  MessageCircle, 
  MousePointerClick, 
  ChevronLeft, 
  ChevronRight,
  ShoppingCart,
  Shovel
} from 'lucide-react';
import { CATEGORIES } from '../../constants';
import { getProducts } from '../../services/storageService';
import { Product } from '../../types';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch products for the carousel (limit to first 6 active products)
    const allProducts = getProducts();
    const active = allProducts.filter(p => p.status === 'active').slice(0, 8);
    setFeaturedProducts(active);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="space-y-20 pb-16 bg-iza-beige/30">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-iza-green">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470058869958-2a77ade41c02?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center" />
        
        <div className="relative z-20 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-lg leading-tight">
            Cultive vida <br/> em seu lar
          </h1>
          <p className="text-xl md:text-2xl mb-10 font-light text-iza-mint max-w-2xl mx-auto drop-shadow-md">
            Do vaso à terra, da muda à decoração. Tudo o que você precisa para transformar seu ambiente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/shop" 
              className="inline-flex items-center justify-center bg-iza-brown hover:bg-[#b08b65] text-white px-8 py-4 rounded-full font-medium transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Ver Catálogo Completo <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Description */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-iza-mint/30">
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1463936575829-25148e1db1b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Sobre a IZAplantas" 
              className="rounded-2xl shadow-lg object-cover h-64 md:h-96 w-full"
            />
          </div>
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-3xl font-bold text-iza-green">Sobre a IZAplantas</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Localizada na Vila Marambaia, a IZAplantas nasceu da paixão por conectar pessoas à natureza. 
              Não somos apenas uma loja; somos um espaço dedicado ao bem-estar que as plantas proporcionam.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              Oferecemos uma curadoria especial de plantas ornamentais, vasos artesanais e substratos preparados 
              para garantir que seu jardim cresça saudável e vibrante, seja em um grande quintal ou na varanda do seu apartamento.
            </p>
            <div className="pt-4">
              <Link to="/contact" className="text-iza-brown font-semibold hover:text-iza-green transition flex items-center">
                Venha nos visitar <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-iza-green mb-12">Como Funciona</h2>
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-iza-mint/50 -z-10 transform scale-x-75" />

          <div className="bg-iza-beige p-8 rounded-2xl relative">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border-4 border-iza-mint text-iza-green">
              <MousePointerClick className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">1. Escolha</h3>
            <p className="text-gray-600">Navegue pelo nosso catálogo online e adicione suas plantas e acessórios favoritos ao carrinho.</p>
          </div>

          <div className="bg-iza-beige p-8 rounded-2xl relative">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border-4 border-iza-mint text-iza-green">
              <MessageCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">2. Combine</h3>
            <p className="text-gray-600">Ao finalizar, seu pedido vai direto para nosso WhatsApp. Tiramos dúvidas e combinamos o pagamento.</p>
          </div>

          <div className="bg-iza-beige p-8 rounded-2xl relative">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border-4 border-iza-mint text-iza-green">
              <Truck className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">3. Receba</h3>
            <p className="text-gray-600">Preparamos tudo com carinho e entregamos na sua casa ou deixamos pronto para retirada.</p>
          </div>
        </div>
      </section>

      {/* Product Carousel */}
      <section className="bg-white py-16 border-y border-iza-mint/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-iza-green">Destaques da Loja</h2>
              <p className="text-gray-500 mt-2">Confira o que está em alta nesta semana</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => scroll('left')} className="p-3 rounded-full border border-gray-200 hover:bg-iza-green hover:text-white transition">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => scroll('right')} className="p-3 rounded-full border border-gray-200 hover:bg-iza-green hover:text-white transition">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {featuredProducts.length > 0 ? (
            <div 
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scroll-smooth no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {featuredProducts.map((product) => (
                <div key={product.id} className="min-w-[280px] w-[280px] md:min-w-[320px] md:w-[320px] snap-start bg-white rounded-xl shadow-sm hover:shadow-lg transition border border-gray-100 flex flex-col">
                  <div className="h-64 overflow-hidden rounded-t-xl bg-gray-100 relative group">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <Link to={`/shop?category=${product.category}`} className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md text-iza-green opacity-0 group-hover:opacity-100 transition transform translate-y-2 group-hover:translate-y-0">
                      <ShoppingCart className="w-5 h-5" />
                    </Link>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-xs font-bold text-iza-brown uppercase tracking-wider mb-1">{product.category}</span>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{product.name}</h3>
                    <div className="mt-auto flex justify-between items-center">
                      <span className="text-xl font-bold text-iza-green">R$ {product.salePrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-xl">
              <p className="text-gray-500">Carregando destaques...</p>
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link to="/shop" className="text-iza-green font-semibold border-b-2 border-iza-green hover:text-iza-brown hover:border-iza-brown transition pb-1">
              Ver todos os produtos
            </Link>
          </div>
        </div>
      </section>

      {/* Accessories / How to Use */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 space-y-8">
            <h2 className="text-3xl font-bold text-iza-green">Acessórios Essenciais</h2>
            <p className="text-gray-600 text-lg">
              Para ter plantas bonitas, não basta apenas regar. O segredo está na base. Veja como nossos acessórios ajudam:
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-iza-brown/20 p-3 rounded-xl h-fit">
                  <Shovel className="w-6 h-6 text-iza-brown" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Substratos Especiais</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Cada planta pede uma "terra" diferente. Temos misturas aeradas para suculentas e terras ricas em matéria orgânica para folhagens.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-iza-brown/20 p-3 rounded-xl h-fit">
                  <Leaf className="w-6 h-6 text-iza-brown" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Vasos que Respiram</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Nossos vasos de cerâmica e barro permitem que as raízes respirem, evitando o apodrecimento e decorando com charme rústico.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-iza-brown/20 p-3 rounded-xl h-fit">
                  <Droplets className="w-6 h-6 text-iza-brown" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Argila e Drenagem</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Use argila expandida no fundo do vaso para garantir que a água escoe corretamente. Saúde total para suas raízes.
                  </p>
                </div>
              </div>
            </div>
            
            <Link to="/shop?category=Acessórios" className="inline-block bg-iza-green text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition mt-4">
              Ver Acessórios
            </Link>
          </div>
          
          <div className="order-1 md:order-2 relative">
            <div className="absolute -top-4 -right-4 w-2/3 h-2/3 bg-iza-mint rounded-full opacity-50 blur-3xl -z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1599818462053-29f456860d47?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Cuidados com Jardim" 
              className="rounded-3xl shadow-xl w-full object-cover h-[500px]"
            />
          </div>
        </div>
      </section>

      {/* Main Features (Plants) */}
      <section className="bg-iza-green py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">O Poder das Plantas</h2>
            <p className="text-iza-mint max-w-2xl mx-auto">Mais do que decoração, ter plantas em casa traz benefícios reais para sua saúde e bem-estar.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition">
              <Sun className="w-12 h-12 text-iza-mint mb-6" />
              <h3 className="text-xl font-bold mb-3">Purificação do Ar</h3>
              <p className="text-white/80 leading-relaxed">
                Plantas como a Jiboia e a Espada-de-são-jorge filtram toxinas do ambiente e liberam oxigênio puro.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition">
              <Leaf className="w-12 h-12 text-iza-mint mb-6" />
              <h3 className="text-xl font-bold mb-3">Redução do Estresse</h3>
              <p className="text-white/80 leading-relaxed">
                Cuidar de um jardim é terapêutico. Estudos mostram que a presença de verde diminui a ansiedade e melhora o humor.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition">
              <Droplets className="w-12 h-12 text-iza-mint mb-6" />
              <h3 className="text-xl font-bold mb-3">Umidade Natural</h3>
              <p className="text-white/80 leading-relaxed">
                As plantas transpiram e ajudam a manter a umidade do ar em níveis agradáveis, ótimo para dias secos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Categories Links */}
      <section className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Navegue por Categoria</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {CATEGORIES.map((cat) => (
            <Link 
              key={cat} 
              to={`/shop?category=${cat}`}
              className="px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-iza-green hover:text-iza-green hover:shadow-md transition"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;