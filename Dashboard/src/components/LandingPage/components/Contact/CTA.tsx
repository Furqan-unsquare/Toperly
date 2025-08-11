import React from 'react';

const MapEmbed = () => {
  return (
    <div className="w-full h-[400px] rounded-md overflow-hidden mt-8">
      <iframe
        title="Google Map - Sector 42 Gurugram"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.065951081416!2d77.0998623150836!3d28.45818988249195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1f34635d94a1%3A0xf4ac7342352e9d0f!2sSector%2042%2C%20Gurugram%2C%20Haryana%20122002!5e0!3m2!1sen!2sin!4v1690436756679!5m2!1sen!2sin"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default MapEmbed;
