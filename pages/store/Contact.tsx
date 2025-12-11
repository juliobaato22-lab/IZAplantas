import React from 'react';
import { MapPin, Phone, Instagram, Clock } from 'lucide-react';
import { STORE_INFO } from '../../constants';

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-iza-green text-center mb-12">Entre em Contato</h1>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Info Cards */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-iza-mint flex items-start gap-4">
            <div className="bg-iza-mint/40 p-3 rounded-full text-iza-green">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">Localização</h3>
              <p className="text-gray-600">{STORE_INFO.address}</p>
              <p className="text-sm text-gray-500 mt-1 italic">{STORE_INFO.reference}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-iza-mint flex items-start gap-4">
            <div className="bg-iza-mint/40 p-3 rounded-full text-iza-green">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">Horário de Funcionamento</h3>
              <p className="text-gray-600 whitespace-pre-line">{STORE_INFO.hours.replace('|', '\n')}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-iza-mint flex items-start gap-4">
            <div className="bg-iza-mint/40 p-3 rounded-full text-iza-green">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">WhatsApp</h3>
              <p className="text-gray-600 mb-2">{STORE_INFO.whatsappDisplay}</p>
              <a 
                href={`https://wa.me/${STORE_INFO.whatsapp}`} 
                target="_blank" 
                rel="noreferrer"
                className="text-sm text-iza-green font-semibold hover:underline"
              >
                Iniciar conversa &rarr;
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-iza-mint flex items-start gap-4">
            <div className="bg-iza-mint/40 p-3 rounded-full text-iza-green">
              <Instagram className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">Instagram</h3>
              <p className="text-gray-600 mb-2">{STORE_INFO.instagram}</p>
              <a 
                href={`https://instagram.com/${STORE_INFO.instagram.replace('@', '')}`} 
                target="_blank" 
                rel="noreferrer"
                className="text-sm text-iza-green font-semibold hover:underline"
              >
                Ver fotos &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-gray-200 rounded-3xl overflow-hidden h-full min-h-[400px] relative shadow-inner">
           <iframe 
             title="IZAplantas Map"
             width="100%" 
             height="100%" 
             frameBorder="0" 
             style={{border:0}}
             src={`https://maps.google.com/maps?q=Vila%20Marambaia%20KM6&t=&z=13&ie=UTF8&iwloc=&output=embed`}
             allowFullScreen
           ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;