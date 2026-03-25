import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Listing } from "@workspace/api-client-react";
import { motion } from "framer-motion";

export function getWearColorClass(wear: string | null | undefined) {
  switch (wear) {
    case "Factory New": return "text-emerald-400 border-emerald-400/20 bg-emerald-400/10";
    case "Minimal Wear": return "text-lime-400 border-lime-400/20 bg-lime-400/10";
    case "Field-Tested": return "text-yellow-400 border-yellow-400/20 bg-yellow-400/10";
    case "Well-Worn": return "text-orange-400 border-orange-400/20 bg-orange-400/10";
    case "Battle-Scarred": return "text-red-400 border-red-400/20 bg-red-400/10";
    default: return "text-muted-foreground border-muted bg-muted/20";
  }
}

const GAME_BADGE: Record<string, string> = {
  CS2: "border-orange-500/40 text-orange-400 bg-orange-500/10",
  TF2: "border-rose-500/40 text-rose-400 bg-rose-500/10",
  Roblox: "border-sky-500/40 text-sky-400 bg-sky-500/10",
};

export function ListingCard({ listing }: { listing: Listing }) {
  const isTraded = listing.status !== "active";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link href={`/listing/${listing.id}`} className="block h-full outline-none">
        <Card className={`h-full overflow-hidden border-border/50 bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300 group shadow-lg ${isTraded ? "opacity-60" : ""}`}>
          <div className="relative aspect-[4/3] bg-gradient-to-b from-muted/30 to-background flex items-center justify-center p-4 overflow-hidden">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-radial-gradient from-primary/10 to-transparent transition-opacity duration-500" />
            <img
              src={listing.imageUrl || `${import.meta.env.BASE_URL}images/placeholder-skin.png`}
              alt={listing.skinName}
              className="object-contain w-full h-full drop-shadow-2xl group-hover:scale-110 transition-transform duration-500 ease-out"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `${import.meta.env.BASE_URL}images/placeholder-skin.png`;
              }}
            />
            <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
              <Badge variant="outline" className={`backdrop-blur-md text-[10px] font-bold ${GAME_BADGE[listing.game] ?? ""}`}>
                {listing.game}
              </Badge>
              {isTraded ? (
                <Badge variant="destructive" className="font-bold">TRADED</Badge>
              ) : (
                listing.wear && (
                  <Badge variant="outline" className={`backdrop-blur-md ${getWearColorClass(listing.wear)}`}>
                    {listing.wear}
                  </Badge>
                )
              )}
            </div>
          </div>

          <CardContent className="p-4 pt-5">
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">
              {listing.itemType}
            </div>
            <h3 className="font-display font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors">
              {listing.skinName}
            </h3>
            {listing.float !== null && listing.float !== undefined && (
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Float:</span>
                <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
                  {listing.float.toFixed(4)}
                </span>
              </div>
            )}
          </CardContent>

          <CardFooter className="p-4 pt-0 flex items-center justify-between border-t border-border/30 mt-auto bg-muted/10">
            <div className="flex items-center gap-2 pt-3">
              <Avatar className="w-6 h-6 border border-border">
                <AvatarImage src={listing.seller?.avatarUrl} />
                <AvatarFallback className="text-[10px]">
                  {listing.seller?.displayName?.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                {listing.seller?.displayName}
              </span>
            </div>
            <div className="pt-3">
              <Badge variant="outline" className="text-primary border-primary/30 font-bold">
                Skin for Skin
              </Badge>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
