# Convert markdown to docx
  
export MERMAID_FILTER_PUPPETEER_CONFIG="$HOME/.mermaid-puppeteer.json"
export MERMAID_FILTER_BACKGROUND="white"
export MERMAID_FILTER_FORMAT="png"
pandoc docs/drafts/pilot-northstar-wireframe.md --from gfm --to docx --filter mermaid-filter --toc --toc-depth=2 -o ~/Desktop/pilot-northstar.docx

## Extract high res mermaid images from markdown doc

mmdc -p ~/.mermaid-puppeteer.json \
     -i docs/pilot-northstar.md \
     -o /tmp/diagram.png
