interface RobberyPhaseProps {
  phaseNumber: string;
}

export default function RobberyPhase({ phaseNumber }: RobberyPhaseProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold mb-4">Robbery Phase {phaseNumber}</h1>
      <p className="text-gray-600">Execute the heist!</p>
    </div>
  );
}
