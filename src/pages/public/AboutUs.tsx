import { CheckCircle, Award, Shield, Users } from 'lucide-react';
import { PublicLayout } from '../../components/public/PublicLayout';

export function AboutUs() {
  return (
    <PublicLayout>
    <div className="min-h-screen">
      <div className="relative h-[400px] overflow-hidden">
        <img
          src="https://www.savremendom.com/f/pics/o-nama/97126981n_b.jpg"
          alt="Savremen Dom kancelarija"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <h1 className="text-5xl font-bold mb-4">O nama</h1>
            <p className="text-xl max-w-2xl">
              Vaš pouzdan partner u svetu nekretnina
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Dobrodošli u Savremen Dom
            </h2>
            <div className="prose prose-lg text-gray-600 space-y-4">
              <p>
                <strong>Agencija za promet nekretnina "Savremen Dom"</strong> pruža kompletnu uslugu posredovanja u prodaji, kupovini i izdavanju nekretnina u Kragujevcu.
              </p>
              <p>
                Nalazimo se u Kragujevcu u Karađorđevoj ulici br.31 gde će Vam u prijatnom ambijentu biti prezentovana baza podataka kao i fotografije svih nekretnina na tržištu. Tako štedeći Vaše vreme možemo zajedno odabrati nekretnine koje ćete obići i tako odabrati pravi dom za Vas.
              </p>
              <p className="font-semibold" style={{ color: '#7096AF' }}>
                Agencija Savremen Dom upisana je u registar posrednika pod brojem 230 i poseduje Licencu Ministarstva trgovine.
              </p>
              <p>
                Donošenje odluke o kupovini i prodaji nepokretnosti predstavlja jedan od najznačajnijih koraka u životu svakog pojedinca. Upravo na toj činjenici se i zasniva naš rad. Otklonićemo Vaše dileme i strahove angažovanjem profesionalnog tima agenata, menadžera i advokata, tako da je sigurnost investiranja Vašeg kapitala maksimalna.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <img
              src="https://www.savremendom.com/f/pics/o-nama/Screen-Shot-2025-01-15-at-11.40.00-AM_m.png"
              alt="Kancelarija"
              className="w-full rounded-lg shadow-lg"
            />
            <img
              src="https://www.savremendom.com/f/pics/o-nama/98189553n_m.jpg"
              alt="Tim"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#7096AF' }}>
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Licencirani</h3>
            <p className="text-gray-600">
              Licenca Ministarstva trgovine
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#7096AF' }}>
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sigurnost</h3>
            <p className="text-gray-600">
              Maksimalna zaštita vaše investicije
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#7096AF' }}>
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Profesionalan tim</h3>
            <p className="text-gray-600">
              Agenti, menadžeri i advokati
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#7096AF' }}>
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Pouzdanost</h3>
            <p className="text-gray-600">
              Godina iskustva i zadovoljnih klijenata
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Naše usluge</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#7096AF' }}>
                Posredovanje u prometu nepokretnosti
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#7096AF' }} />
                  <span className="text-gray-700">Kupovina i prodaja stanova</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#7096AF' }} />
                  <span className="text-gray-700">Kupovina i prodaja kuća</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#7096AF' }} />
                  <span className="text-gray-700">Kupovina i prodaja poslovnih prostora</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#7096AF' }} />
                  <span className="text-gray-700">Kupovina i prodaja zemljišta</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#7096AF' }} />
                  <span className="text-gray-700">Izdavanje i iznajmljivanje nekretnina</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#7096AF' }}>
                Dodatne usluge
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#7096AF' }} />
                  <span className="text-gray-700">Pravno savetovanje</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#7096AF' }} />
                  <span className="text-gray-700">Advokatske usluge</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#7096AF' }} />
                  <span className="text-gray-700">Provera pravne dokumentacije</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#7096AF' }} />
                  <span className="text-gray-700">Procena vrednosti nekretnina</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#7096AF' }} />
                  <span className="text-gray-700">Pomoć kod kreditiranja</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Vaše zadovoljstvo je naše merilo uspeha
          </h2>
          <p className="text-gray-600 mb-6">Srdačan pozdrav,</p>
          <p className="text-xl font-semibold" style={{ color: '#7096AF' }}>
            Danijela Jovanović
          </p>
          <p className="text-gray-600">Direktor</p>
        </div>
      </div>
    </div>
    </PublicLayout>
  );
}
