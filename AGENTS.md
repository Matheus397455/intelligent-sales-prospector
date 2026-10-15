<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Project rules (SIPC)
- All private pages live under `src/routes/_authenticated/` (client-only auth gate); sidebar entries come from `src/lib/navigation.ts` — keep both in sync so every menu item opens a real page.
- Every user-owned table has `owner_id default auth.uid()` + owner-only RLS; add new tables the same way so data stays private per account.
- Dashboard numbers are queried from the database (`src/lib/dashboard.ts`); never show estimated or fake metrics.
- Status labels/colors are centralized in `src/lib/status.ts`; use `StatusBadge` instead of ad-hoc badges.
- Colors come from semantic tokens in `src/styles.css` (always-dark theme); no hardcoded color utilities.
- App errors are persisted via `logAppError` (`src/lib/error-log.ts`) and shown in Logs; never include secrets in context.
