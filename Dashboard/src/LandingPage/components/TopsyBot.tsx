import { motion } from 'framer-motion';

const TopsyBot = () => {
  return (
   <motion.div
  className="fixed -bottom-4 -right-6 z-10 drop-shadow-xl pointer-events-none" // 👈 prevents blocking
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  <motion.div
    className="flex items-center justify-center rounded-xl overflow-hidden pointer-events-auto" // 👈 only widget clickable
    style={{
      width: "350px",
      height: "600px",
    }}
  >
    <elevenlabs-convai agent-id="agent_8701k42d5y1xen7a2abayh6ehq5c"></elevenlabs-convai>
    <script
      src="https://unpkg.com/@elevenlabs/convai-widget-embed"
      async
      type="text/javascript"
    ></script>
  </motion.div>
</motion.div>

  );
};

export default TopsyBot;
