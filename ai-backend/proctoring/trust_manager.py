class TrustManager:

    def __init__(self):
        self.score = 0

        # Track how many times each reason triggered
        self.reason_counts = {}

        # Optional: track unique reasons for summary
        self.triggered_reasons = set()

        # Max times a reason can reduce score
        self.max_penalty_per_reason = 2   # 🔥 you can change (1,2,3)

    def add_event(self, reason, points):
        # Get how many times this reason was triggered
        count = self.reason_counts.get(reason, 0)

        # Apply penalty only if under limit
        if count < self.max_penalty_per_reason:
            self.score += points
            self.reason_counts[reason] = count + 1
            self.triggered_reasons.add(reason)

    def get_trust_percentage(self):
        trust = 100 - self.score
        return max(trust, 0)

    def get_final_score(self):
        return self.score

    def get_summary(self):
        return {
            "Total Unique Violations": len(self.triggered_reasons),
            "Violation Details": self.reason_counts,
            "Trust %": self.get_trust_percentage(),
            "Score": self.score
        }