/** @jsxRuntime automatic @jsxImportSource react */
// Render every location scene to a static SVG for visual inspection.
import { renderToStaticMarkup } from 'react-dom/server';
import { writeFileSync } from 'fs';
import IsoScene, { Cart, iso } from '../src/ui/scene/IsoScene';
import Person from '../src/ui/scene/Person';
import { LAYOUTS, walkPoint, queueSpot } from '../src/ui/scene/layouts';
import { LOCATIONS } from '../src/game/content/locations';

const outDir = process.argv[2];
const weatherFor: Record<string, string> = {
  venice: 'perfect75',
  santamonica: 'perfect75',
  culver: 'heatwave',
  palisades: 'junegloom',
  beverlyhills: 'rain',
  silverlake: 'santaana',
};
const stageFor: Record<string, number> = {
  driveway: 0,
  silverlake: 1,
  culver: 2,
  venice: 3,
};

for (const loc of LOCATIONS) {
  const layout = LAYOUTS[loc.id];
  const svg = renderToStaticMarkup(
    <IsoScene loc={loc} weatherId={weatherFor[loc.id] ?? 'perfect75'}>
      <Cart x={layout.cart[0]} y={layout.cart[1]} stage={stageFor[loc.id] ?? 0} />
      {[0, 1, 2].map((qi) => {
        const [gx, gy] = queueSpot(layout, qi);
        const [px, py] = iso(gx, gy);
        return <Person key={`q${qi}`} variant={qi} walking={false} bubble={qi === 0 ? 'happy' : null} x={px} y={py} locId={loc.id} />;
      })}
      {[0.05, 0.2, 0.35, 0.55, 0.7, 0.85, 1.0, 1.1, 1.2].map((p, i) => {
        const [gx, gy] = walkPoint(layout, p);
        const [px, py] = iso(gx, gy);
        return <Person key={i} variant={i * 7 + 4} walking={true} bubble={i === 2 ? 'price' : null} x={px} y={py} locId={loc.id} />;
      })}
    </IsoScene>,
  );
  writeFileSync(
    `${outDir}/scene-${loc.id}.svg`,
    svg
      .replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg" width="960" height="470"')
      .replace('style="display:block;width:100%;height:100%"', ''),
  );
  console.log(`wrote scene-${loc.id}.svg`);
}
