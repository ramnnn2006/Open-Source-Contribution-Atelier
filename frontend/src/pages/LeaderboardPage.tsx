import { useQuery } from "@tanstack/react-query";
import { Crown } from "lucide-react";
import { SectionCard } from "../components/ui/SectionCard";
import { fetchApi } from "../lib/api";
import SkeletonLeaderboard from "../components/ui/skeletons/SkeletonLeaderboard";

interface LeaderboardEntry {
  id: number;
  username: string;
  score: number;
  avatar_url: string;
}

const rankAccent = (rank: number) => {
  if (rank === 1) return "bg-surface-highest text-black";
  if (rank === 2) return "bg-surface-high text-black";
  if (rank === 3) return "bg-surface-low text-black";
  return "bg-surface-lowest text-muted";
};

export function LeaderboardPage() {
  const { data: leaderboard = [], isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard"],
    queryFn: () => fetchApi("/progress/leaderboard/"),
  });

  return (
    <div className="space-y-6">
      <SectionCard eyebrow="Community" title="Global Contributor Leaderboard">
        <p className="max-w-2xl text-sm leading-6 text-muted">
          The top 100 contributors ranked by total score earned across every lesson and
          challenge in the Atelier. Climb the ranks by shipping more contributions.
        </p>
      </SectionCard>

      {isLoading ? (
        <div aria-busy="true">
          <SkeletonLeaderboard />
        </div>
      ) : leaderboard.length > 0 ? (
        <div className="overflow-hidden rounded-[24px] border border-outline bg-surface-high/80 shadow-card backdrop-blur-xl">
          {/* Header row */}
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-outline px-5 py-4 font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-muted">
            <span className="w-10 text-center">Rank</span>
            <span>Contributor</span>
            <span className="text-right">Score</span>
          </div>

          <div className="divide-y divide-outline/40">
            {leaderboard.map((entry, index) => {
              const rank = index + 1;
              return (
                <div
                  key={entry.id}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-3 transition hover:bg-surface-low/60"
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-black text-sm font-black shadow-card-sm ${rankAccent(
                      rank,
                    )}`}
                  >
                    {rank === 1 ? <Crown size={16} /> : rank}
                  </span>

                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src={entry.avatar_url}
                      alt={entry.username}
                      loading="lazy"
                      className="h-9 w-9 shrink-0 rounded-full border-2 border-black bg-white"
                    />
                    <span className="truncate font-semibold text-text dark:text-[#f0ebe2]">
                      {entry.username}
                    </span>
                  </div>

                  <span className="text-right font-black text-primary">
                    {entry.score.toLocaleString()}
                    <span className="ml-1 text-xs font-bold text-muted">XP</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border-4 border-dashed border-black bg-surface-low p-8 text-center">
          <p className="font-bold text-muted">
            No contributors on the board yet. Complete a lesson to claim the top spot! 🏆
          </p>
        </div>
      )}
    </div>
  );
}
