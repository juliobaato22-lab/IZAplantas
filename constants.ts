import { Category } from "./types";

export const CATEGORIES: Category[] = [
  'Plantas',
  'Vasos',
  'Terra',
  'Substrato',
  'Acessórios',
  'Decoração'
];

export const STORE_INFO = {
  name: "IZAplantas - Floricultura",
  address: "Vila Marambaia KM6 – CEP 45530-000",
  reference: "Atrás do Posto da Polícia Rodoviária",
  whatsapp: "5573999535407",
  whatsappDisplay: "(73) 99953-5407",
  instagram: "@jardin.iza",
  hours: "Seg–Sex: 08h–17h | Sáb: 08h–12h"
};

export const MOCK_PRODUCTS_INIT = [
  {
    id: '1',
    code: 'PL001',
    name: 'Costela de Adão',
    description: 'Planta ornamental de folhas grandes e recortadas.',
    category: 'Plantas',
    costPrice: 20,
    salePrice: 45.00,
    stock: 15,
    minStock: 5,
    unit: 'un',
    status: 'active',
    image: 'https://picsum.photos/400/400?random=1',
    details: { sunNeeds: 'Meia Sombra', wateringFreq: '2x por semana' },
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    code: 'VS001',
    name: 'Vaso Cerâmica Rústico',
    description: 'Vaso artesanal de barro.',
    category: 'Vasos',
    costPrice: 15,
    salePrice: 32.90,
    stock: 30,
    minStock: 10,
    unit: 'un',
    status: 'active',
    image: 'https://picsum.photos/400/400?random=2',
    details: { material: 'Cerâmica', dimensions: '30x30cm' },
    createdAt: new Date().toISOString()
  }
];