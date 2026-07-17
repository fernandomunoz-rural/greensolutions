import { Container, Button } from "@/components/ui";
import { Icon } from "@/components/icons";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-forest/[0.06] text-forest">
        <Icon.Leaf className="h-7 w-7" />
      </span>
      <h1 className="font-display mt-6 text-4xl font-semibold text-forest">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-ink/70">
        This page may have been moved or doesn&apos;t exist yet. Let&apos;s get
        you back to growing.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/">Back home</Button>
        <Button href="/learn" variant="ghost">
          Browse guides
        </Button>
      </div>
    </Container>
  );
}
