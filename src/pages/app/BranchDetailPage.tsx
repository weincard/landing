import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Stack,
  Group,
  Title,
  Text,
  Badge,
  Paper,
  Button,
  ActionIcon,
  Divider,
  Rating,
  Textarea,
  Skeleton,
  Alert,
  Avatar,
  SimpleGrid,
  Box,
} from "@mantine/core";
import { ArrowLeft, Heart, HeartOff, Phone, Globe, Star, Zap } from "lucide-react";
import { toast } from "sonner";
import { useBranchDetail } from "@/hooks/useBranches";
import {
  useFavorites,
  useAddFavorite,
  useRemoveFavorite,
} from "@/hooks/useFavorites";
import { useReviews, useCreateReview } from "@/hooks/useReviews";
import { DayBadges } from "@/components/catalog/DayBadges";
import { PageMeta } from "@/components/layout/PageMeta";
import {
  OFFER_TYPE_LABELS,
  OFFER_TYPE_COLORS,
  formatOfferValue,
} from "@/lib/offerTypes";
import { useAuth } from "@/context/AuthContext";

export function BranchDetailPage() {
  const { branchId: branchIdParam } = useParams<{ branchId: string }>();
  const branchId = Number(branchIdParam ?? "0");
  const navigate = useNavigate();
  const { hasMembership } = useAuth();

  const { data: branch, isLoading, isError } = useBranchDetail(branchId);
  const { data: favorites = [] } = useFavorites();
  const { data: reviews = [], isLoading: loadingReviews } =
    useReviews(branchId);
  const addFav = useAddFavorite();
  const removeFav = useRemoveFavorite();
  const createReview = useCreateReview(branchId);

  const [imgIndex, setImgIndex] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    setIsFav(favorites.some((f) => f.branch.branchId === branchId));
  }, [favorites, branchId]);

  function toggleFavorite() {
    if (isFav) {
      setIsFav(false);
      removeFav.mutate(branchId, { onError: () => setIsFav(true) });
    } else {
      setIsFav(true);
      addFav.mutate(branchId, { onError: () => setIsFav(false) });
    }
  }

  async function submitReview() {
    if (reviewRating === 0) {
      toast.error("Selecciona una calificación.");
      return;
    }
    try {
      await createReview.mutateAsync({
        rating: reviewRating,
        comment: reviewComment,
      });
      toast.success("Reseña enviada.");
      setReviewRating(0);
      setReviewComment("");
    } catch {
      toast.error("No se pudo enviar la reseña.");
    }
  }

  if (isLoading) {
    return (
      <Stack gap="lg" py="lg">
        <Skeleton height={300} radius="xl" />
        <Skeleton height={40} width="60%" />
        <Skeleton height={20} width="40%" />
        <SimpleGrid cols={2}>
          <Skeleton height={120} radius="xl" />
          <Skeleton height={120} radius="xl" />
        </SimpleGrid>
      </Stack>
    );
  }

  if (isError || !branch) {
    return (
      <Stack py="lg">
        <Alert color="red">No se pudo cargar el restaurante.</Alert>
        <Button
          variant="subtle"
          color="dark"
          onClick={() => navigate(-1)}
          leftSection={<ArrowLeft size={14} />}
        >
          Volver
        </Button>
      </Stack>
    );
  }

  const images = branch.images?.length
    ? branch.images
    : branch.coverImageUrl
      ? [branch.coverImageUrl]
      : [];

  // Defensive: the branch-detail payload may omit `offers` entirely.
  const offers = branch.offers ?? [];
  return (
    <>
      <PageMeta
        title={branch.name}
        description={branch.description}
        path={`/app/explore/${branchId}`}
      />
      <Stack gap="lg" py="lg" maw={900} mx="auto">
        {/* Back */}
        <Button
          variant="subtle"
          color="dark"
          size="xs"
          leftSection={<ArrowLeft size={14} />}
          onClick={() => navigate(-1)}
          style={{ alignSelf: "flex-start" }}
        >
          Volver
        </Button>

        {/* Main content */}
        <Group align="flex-start" gap="xl">
          {/* Left column */}
          <Stack flex={1} gap="lg" style={{ minWidth: 0 }}>
            {/* Image gallery */}
            {images.length > 0 && (
              <Box
                style={{
                  position: "relative",
                  borderRadius: 16,
                  overflow: "hidden",
                  aspectRatio: "16/9",
                  background: "#f3f4f6",
                }}
              >
                <img
                  src={images[imgIndex]}
                  alt={`${branch.name} ${imgIndex + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                {images.length > 1 && (
                  <Group
                    justify="center"
                    gap={6}
                    mt="xs"
                    style={{
                      position: "absolute",
                      bottom: 12,
                      left: 0,
                      right: 0,
                    }}
                  >
                    {images.map((_, i) => (
                      <Box
                        key={i}
                        onClick={() => setImgIndex(i)}
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background:
                            i === imgIndex ? "#fff" : "rgba(255,255,255,0.5)",
                          cursor: "pointer",
                        }}
                      />
                    ))}
                  </Group>
                )}
              </Box>
            )}

            {/* Branch header */}
            <Group align="flex-start" gap="md">
              {branch.logoUrl && (
                <img
                  src={branch.logoUrl}
                  alt={`Logo ${branch.name}`}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    objectFit: "contain",
                    background: "#f7f5f3",
                  }}
                />
              )}
              <Stack gap={4} flex={1}>
                <Title
                  order={3}
                  style={{ fontFamily: '"Clash Grotesk", sans-serif' }}
                >
                  {branch.name}
                </Title>
                {branch.category?.name && (
                  <Badge color="dark" variant="filled" size="sm" radius="xl">
                    {branch.category.name}
                  </Badge>
                )}
                {branch.address && (
                  <Text size="sm" c="dimmed">
                    {branch.address}, {branch.city}
                  </Text>
                )}
              </Stack>
            </Group>

            {/* Direct redeem CTA — mirrors the mobile branch-detail shortcut:
                straight to code generation for THIS branch, no picker step. */}
            {hasMembership && (
              <Button
                color="dark"
                radius="xl"
                size="md"
                leftSection={<Zap size={16} />}
                component={Link}
                to={`/app/redeem/${branchId}`}
              >
                Usar mi Weincard
              </Button>
            )}

            {branch.description && (
              <Text size="sm" c="dimmed" style={{ lineHeight: 1.7 }}>
                {branch.description}
              </Text>
            )}

            <Divider />

            {/* Offers */}
            {offers.length > 0 && (
              <Stack gap="md">
                <Text
                  fw={700}
                  size="xs"
                  tt="uppercase"
                  c="dimmed"
                  style={{ letterSpacing: "0.08em" }}
                >
                  Beneficios
                </Text>

                {offers.map((offer) => {
                  const typeColor =
                    OFFER_TYPE_COLORS[offer.offerType] ?? "#1B1A1A";
                  return (
                    <Paper
                      key={offer.offerId}
                      radius="lg"
                      withBorder
                      style={{ overflow: "hidden" }}
                    >
                      <Group gap={0} align="stretch" wrap="nowrap">
                        {/* Left: headline value (e.g. "20%", "$15.000", "2x1") */}
                        <Box
                          style={{
                            width: 108,
                            flexShrink: 0,
                            background: `${typeColor}14`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 12,
                          }}
                        >
                          <Text
                            fw={800}
                            ta="center"
                            style={{
                              color: typeColor,
                              fontSize: 18,
                              lineHeight: 1.1,
                              fontFamily: '"Clash Grotesk", sans-serif',
                              wordBreak: "break-word",
                            }}
                          >
                            {formatOfferValue(offer)}
                          </Text>
                        </Box>

                        {/* Right: title, description, valid days */}
                        <Box style={{ flex: 1, padding: 16, minWidth: 0 }}>
                          <Group
                            justify="space-between"
                            align="flex-start"
                            gap="xs"
                            mb={4}
                          >
                            <Text fw={700} size="sm" style={{ flex: 1 }}>
                              {offer.title}
                            </Text>
                            <Badge
                              size="xs"
                              radius="xl"
                              variant="light"
                              color="gray"
                            >
                              {OFFER_TYPE_LABELS[offer.offerType] ??
                                offer.offerType}
                            </Badge>
                          </Group>
                          {offer.description && (
                            <Text size="xs" c="dimmed" mb={8}>
                              {offer.description}
                            </Text>
                          )}
                          <DayBadges validDays={offer.validDays} />
                        </Box>
                      </Group>
                      {/* Conditions footer */}
                      {offer.conditions && (
                        <Box
                          style={{
                            borderTop: "1px solid var(--mantine-color-gray-2)",
                            padding: "10px 16px",
                          }}
                        >
                          <Text size="xs" c="dimmed">
                            {offer.conditions}
                          </Text>
                        </Box>
                      )}
                    </Paper>
                  );
                })}
              </Stack>
            )}

            <Divider />

            {/* Reviews */}
            <Stack gap="md">
              <Text
                fw={700}
                size="xs"
                tt="uppercase"
                c="dimmed"
                style={{ letterSpacing: "0.08em" }}
              >
                Reseñas
              </Text>

              {loadingReviews && <Skeleton height={80} radius="xl" />}

              {!loadingReviews && reviews.length === 0 && (
                <Text size="sm" c="dimmed">
                  Aún no hay reseñas. ¡Sé el primero!
                </Text>
              )}

              {reviews.map((review) => (
                <Paper key={review.reviewId} radius="xl" p="md" withBorder>
                  <Group gap="sm" mb="xs">
                    <Avatar size={32} color="dark" radius="xl">
                      {review.user.name?.[0] ?? "?"}
                    </Avatar>
                    <Stack gap={2}>
                      <Text size="xs" fw={700}>
                        {[review.user.name, review.user.lastname]
                          .filter(Boolean)
                          .join(" ")}
                      </Text>
                      <Rating value={review.rating} readOnly size="xs" />
                    </Stack>
                  </Group>
                  {review.comment && (
                    <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                      {review.comment}
                    </Text>
                  )}
                </Paper>
              ))}

              {/* Leave a review */}
              {hasMembership && (
                <Paper radius="xl" p="lg" withBorder>
                  <Text fw={700} size="sm" mb="md">
                    Deja tu reseña
                  </Text>
                  <Stack gap="sm">
                    <Rating
                      value={reviewRating}
                      onChange={setReviewRating}
                      emptySymbol={<Star size={20} />}
                      fullSymbol={<Star size={20} fill="currentColor" />}
                    />
                    <Textarea
                      placeholder="Cuéntanos tu experiencia..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.currentTarget.value)}
                      minRows={2}
                    />
                    <Button
                      size="xs"
                      color="dark"
                      onClick={submitReview}
                      loading={createReview.isPending}
                    >
                      Enviar reseña
                    </Button>
                  </Stack>
                </Paper>
              )}
            </Stack>
          </Stack>

          {/* Right column (sticky info) */}
          <Box w={220} visibleFrom="md" style={{ flexShrink: 0 }}>
            <Stack gap="sm" style={{ position: "sticky", top: 80 }}>
              <ActionIcon
                onClick={toggleFavorite}
                variant={isFav ? "filled" : "outline"}
                color={isFav ? "red" : "gray"}
                size="lg"
                radius="xl"
                title={isFav ? "Quitar de favoritos" : "Guardar"}
              >
                {isFav ? <HeartOff size={16} /> : <Heart size={16} />}
              </ActionIcon>

              {branch.phone && (
                <Button
                  component="a"
                  href={`https://wa.me/${branch.whatsapp || branch.phone}`}
                  target="_blank"
                  variant="outline"
                  color="dark"
                  size="xs"
                  leftSection={<Phone size={12} />}
                  fullWidth
                >
                  WhatsApp
                </Button>
              )}
              {branch.website && (
                <Button
                  component="a"
                  href={branch.website}
                  target="_blank"
                  variant="subtle"
                  color="dark"
                  size="xs"
                  leftSection={<Globe size={12} />}
                  fullWidth
                >
                  Sitio web
                </Button>
              )}

              <Divider />

              <Text
                size="xs"
                fw={700}
                c="dimmed"
                tt="uppercase"
                style={{ letterSpacing: "0.07em" }}
              >
                Establecimiento
              </Text>
              <Text size="xs" c="dimmed">
                {branch.merchant?.name}
              </Text>
            </Stack>
          </Box>
        </Group>
      </Stack>
    </>
  );
}
