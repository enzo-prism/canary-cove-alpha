import Script from "next/script"

const ELEVENLABS_AGENT_ID = "agent_5001kp10j9k8f3j8hxqcjh1j19gq"
const ELEVENLABS_WIDGET_EMBED_SRC = "https://unpkg.com/@elevenlabs/convai-widget-embed@0.10.0"

export function ElevenLabsConvaiWidget() {
  return (
    <>
      <elevenlabs-convai
        agent-id={ELEVENLABS_AGENT_ID}
        data-testid="elevenlabs-convai-widget"
        variant="tiny"
        dismissible="true"
      />
      <Script
        id="elevenlabs-convai-widget-embed"
        src={ELEVENLABS_WIDGET_EMBED_SRC}
        strategy="lazyOnload"
      />
    </>
  )
}
