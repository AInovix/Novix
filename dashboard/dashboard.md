```yaml
name: Update Dashboard
on:
  schedule:
    - cron: '0 * * * *' # Hourly updates
  workflow_dispatch:

jobs:
  update-dashboard:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Update Contributors
        uses: contributoroom/contributors-svg@main
        with:
          repo: AInovix/novix
          path: PROJECT DASHBOARD.md
          
      - name: Update Activity
        run: |
          LAST_COMMIT=$(git log -1 --pretty=format:"%s|%H|%cr")
          echo "<!-- ACTIVITY:START -->" > temp.md
          echo "- **Latest Commit**: [${LAST_COMMIT%|*}]($(echo $LAST_COMMIT | cut -d'|' -f2)) - ${LAST_COMMIT##*|}" >> temp.md
          echo "<!-- ACTIVITY:END -->" >> temp.md
          sed -i '/<!-- ACTIVITY:START -->/,/<!-- ACTIVITY:END -->/ {//!d}' DASHBOARD.md
          sed -i '/<!-- ACTIVITY:START -->/r temp.md' DASHBOARD.md
          
      - name: Commit Changes
        run: |
          git config --global user.name "Dashboard Bot"
          git config --global user.email "bot@novix.ai"
          git add DASHBOARD.md
          git commit -m "Update dashboard metrics"
          git push
```
