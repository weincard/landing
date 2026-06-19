import { useNavigate } from "react-router-dom";
import { Stack, Title } from "@mantine/core";
import { BranchBrowser } from "@/components/catalog/BranchBrowser";
import { PageMeta } from "@/components/layout/PageMeta";
import type { Branch } from "@/types";

export function ExplorePage() {
  const navigate = useNavigate();

  return (
    <>
      <PageMeta title="Explorar" description="Descubre restaurantes Weincard." path="/app/explore" />
      <Stack gap="lg" py="lg">
        <Title order={2} style={{ fontFamily: '"Clash Grotesk", sans-serif' }}>
          Explorar
        </Title>

        <BranchBrowser
          onOpenBranch={(branch: Branch) => navigate(`/app/explore/${branch.branchId}`)}
        />
      </Stack>
    </>
  );
}
