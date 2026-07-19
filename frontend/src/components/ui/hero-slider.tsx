'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Button } from '@/components/ui/button'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface SlideData {
  image: string
  title: string
  subtitle: string
  cta: string
  href: string
}

const slides: SlideData[] = [
  {
    image: 'https://res.cloudinary.com/dtkxwlj5g/image/upload/v1784165388/hero_slider_1_bx1ecd.png',
    title: 'Endulzando tus mejores momentos',
    subtitle: 'Descubre nuestra selección de tortas, postres y dulces artesanales elaborados con los mejores ingredientes y mucho amor.',
    cta: 'Ver catálogo completo',
    href: '/products',
  },
  {
    image: 'https://res.cloudinary.com/dtkxwlj5g/image/upload/v1784165656/hero_slider_2_xvwrwg.png',
    title: 'Canjea Descuentos y Más',
    subtitle: 'Con una cuenta creada y con cada compra acumulas puntos que puedes obtener increíbles recompensas.',
    cta: 'Regístrate y gana',
    href: '/auth/register',
  },
  {
    image: 'https://res.cloudinary.com/dtkxwlj5g/image/upload/v1784165660/hero_slider_3_hhdocm.png',
    title: 'Tu Dulce Favorito, a un Paso de Ti',
    subtitle: 'Haz tu pedido y elige retirarlo en nuestras tiendas o recibirlo en la puerta de tu casa, como prefieras.',
    cta: 'Más info. Entrega y Envíos',
    href: '/entrega-y-envios',
  },
]

export default function HeroSlider() {
  return (
    <>
      <style>{`
        .hero-swiper .swiper-button-next,
        .hero-swiper .swiper-button-prev {
          color: white;
          opacity: 0.7;
          transition: opacity 0.3s;
        }
        .hero-swiper .swiper-button-next:hover,
        .hero-swiper .swiper-button-prev:hover {
          opacity: 1;
        }
        .hero-swiper .swiper-button-next::after,
        .hero-swiper .swiper-button-prev::after {
          font-size: 2rem;
        }
        .hero-swiper .swiper-pagination-bullet {
          background: white;
          opacity: 0.5;
          transition: opacity 0.3s, transform 0.3s;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          background: #e11d48;
          opacity: 1;
          transform: scale(1.2);
        }
        @media (min-width: 640px) {
          .hero-swiper .swiper-button-next::after,
          .hero-swiper .swiper-button-prev::after {
            font-size: 2.5rem;
          }
        }
        @media (max-width: 639px) {
          .hero-swiper .swiper-button-next,
          .hero-swiper .swiper-button-prev {
            display: none;
          }
        }
      `}</style>
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        loop
        speed={700}
        navigation
        pagination={{ clickable: true }}
        aria-label="Slider principal"
        className="hero-swiper h-[60vh] sm:h-[80vh] xl:h-[calc(100dvh-64px)] w-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i} aria-roledescription="slide">
            <div className="relative w-full h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={i === 0}
                sizes="100vw"
                quality={85}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex items-center px-6 sm:px-12 lg:px-24">
                <div className="max-w-xl">
                  <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 drop-shadow-md leading-relaxed">
                    {slide.subtitle}
                  </p>
                  <Link href={slide.href}>
                    <Button size="lg" className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-8 text-base">
                      {slide.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
