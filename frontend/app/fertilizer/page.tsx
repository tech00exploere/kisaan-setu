import FertilizerRecommender from '@/components/FertilizerRecommender';

export default function FertilizerPage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-green-800 mb-8">
          🌾 Fertilizer Advisor
        </h1>
        <FertilizerRecommender />
      </div>
    </section>
  );
}
