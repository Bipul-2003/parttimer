import React from 'react';

interface FlagIconProps {
  country: string;
  className?: string;
}

const FlagIcon: React.FC<FlagIconProps> = ({ country, className }) => {
  const flags: { [key: string]: string } = {
    en: "https://flagicons.lipis.dev/flags/4x3/us.svg",
    es: "https://flagicons.lipis.dev/flags/4x3/es.svg",
  };

  return (
    <img
      src={flags[country]}
      alt={`${country} flag`}
      className={`w-5 h-3.5 inline-block ${className || ''}`}
    />
  );
};

export default FlagIcon;
