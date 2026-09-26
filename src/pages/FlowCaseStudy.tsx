import type { ReactNode } from "react";
import "../styles/flow-case-study.css";

const workflowStages = [
  ["Product", "SKU · variants · availability"],
  ["Launch requirements", "channels · dates · deliverables"],
  ["Campaign planning", "brief · dependencies · owners"],
  ["Creator selection", "fit · outreach · collaboration"],
  ["Creator collaboration / Drop", "shipment · tasks · status"],
  ["Fulfillment", "address · inventory · tracking"],
  ["Creator deliverable", "photo · video · version"],
  ["Asset intake", "index · product · creator"],
  ["Approval + rights", "review · usage permission"],
  ["Channel assignment", "social · email · paid · commerce"],
  ["Launch readiness", "dependencies resolved?"],
];

const wedgeStages = [
  "Creator selected",
  "Collaboration / Drop created",
  "Shipping information collected",
  "Fulfillment tracked",
  "Deliverable received",
  "Asset indexed",
  "Usage rights attached",
  "Approved",
  "Launch ready",
];

function SectionLabel({ number, children }: { number: string; children: ReactNode }) {
  return <p className="flow-section-label"><span>{number}</span>{children}</p>;
}

function Status({ children, kind = "hypothesis" }: { children: ReactNode; kind?: "observation" | "research" | "hypothesis" | "assumption" | "concept" | "planned" }) {
  return <span className={`flow-status flow-status-${kind}`}>{children}</span>;
}

export default function FlowCaseStudy() {
  return (
    <article className="flow-case-study">
      <header className="flow-hero">
        <div className="flow-hero-lines" aria-hidden="true"><i /><i /><i /><em /></div>
        <div className="flow-hero-network" aria-label="Flow connects products, creators, assets, campaigns, and launches"><span>Product</span><i>→</i><span>Creator</span><i>→</i><span>Asset</span><i>→</i><span>Campaign</span><i>→</i><strong>Launch</strong></div>
        <div className="flow-hero-content">
          <div className="flow-hero-topline"><Status kind="concept">Discovery + concept exploration</Status><span>Product Strategy · Product Design · AI Systems</span></div>
          <h1 className="display">Flow<span>.</span></h1>
          <p>AI-native marketing operations layer</p>
        </div>
      </header>

      <div className="flow-overview" aria-label="Flow project overview">
        <div><span>Focus</span><strong>Marketing operations orchestration</strong></div>
        <div><span>Stage</span><strong>Discovery + concept exploration</strong></div>
        <div><span>Scope</span><strong>Lean DTC, multi-channel launches</strong></div>
        <div><span>Important</span><strong>Hypothesis-led, not validated</strong></div>
      </div>

      <section className="flow-section flow-problem">
        <SectionLabel number="01">Problem hypothesis</SectionLabel>
        <div className="flow-section-heading"><h2 className="display">The work between the tools may be the work that breaks the launch.</h2><p>Flow began with observations from two small-team contexts, not formal research or proof of a market need.</p></div>
        <div className="flow-observation-path">
          <div className="flow-observation"><Status kind="observation">Personal experience</Status><h3>One person, many handoffs.</h3><p>Running an online store alongside university made content, assets, posting, advertising, and task coordination difficult to keep up with.</p></div>
          <i aria-hidden="true">→</i>
          <div className="flow-observation"><Status kind="observation">Startup observation</Status><h3>Small teams carry large operating loads.</h3><p>At a lean skincare startup, marketing and creator sourcing could sit with a cofounder, with repeat research and data entry delegated where possible.</p></div>
          <i aria-hidden="true">→</i>
          <div className="flow-pattern"><Status kind="hypothesis">Hypothesis</Status><p>As products, launches, creators, assets, and campaigns multiply, someone becomes the human integration layer between them.</p></div>
        </div>
        <div className="flow-hypothesis-statement"><Status kind="hypothesis">Hypothesis</Status><p className="display">Lean DTC brands may not have a shortage of marketing tools. They may have an orchestration problem.</p><p>Flow explores whether software can coordinate the dependencies those tools and workflows leave between people.</p></div>
      </section>

      <section className="flow-section flow-market">
        <SectionLabel number="02">Market + competitive research</SectionLabel>
        <div className="flow-section-heading"><h2 className="display">A crowded category, approached from different centers of gravity.</h2><p><Status kind="research">Secondary / competitive research</Status> Existing products may focus on creator management, content production, campaign execution, publishing, customer intelligence, project management, or enterprise marketing operations.</p></div>
        <p className="flow-landscape-disclaimer">A directional secondary-research framing, not an exhaustive or quantitative market analysis.</p><figure className="flow-landscape">
          <div className="flow-axis flow-axis-y">Operations / infrastructure <span>↑</span><br />Content / execution <span>↓</span></div>
          <div className="flow-landscape-grid" aria-label="Conceptual competitive landscape">
            <span className="flow-landscape-label creator">Creator workflows</span>
            <span className="flow-landscape-label content">Content + publishing</span>
            <span className="flow-landscape-label campaign">Campaign execution</span>
            <span className="flow-landscape-label enterprise">Enterprise marketing operations</span>
            <span className="flow-landscape-flow">Flow<br /><small>hypothesized direction</small></span>
          </div>
          <div className="flow-axis flow-axis-x">Specialized workflow <span>←</span><br /><strong>Cross-functional orchestration →</strong></div>
          <figcaption>Conceptual landscape, not a capability comparison or claim of proven market whitespace. Products previously explored include Gooseworks, Upfluence, Glowtify, DTC Multiplier, Gradial, and Minerva; this page makes no unverified capability claims about them.</figcaption>
        </figure>
        <p className="flow-takeaway"><span>Research takeaway</span>The opportunity may not be another tool that performs one marketing task. It may be coordinating the dependencies between the tools and workflows teams already use.</p>
      </section>

      <section className="flow-section flow-icp">
        <SectionLabel number="03">Hypothesized ICP</SectionLabel>
        <div className="flow-section-heading"><h2 className="display">The defining characteristic is not the vertical. It is operational complexity growing faster than marketing headcount.</h2><p><Status kind="hypothesis">Initial targeting hypothesis</Status> Lean DTC brands running frequent product launches and multi-channel campaigns.</p></div>
        <div className="flow-icp-equation" aria-label="Hypothesized ideal customer profile qualification logic"><div><strong>Lean DTC<br />brand</strong><small>Emerging or growing consumer brand</small></div><i>+</i><div><strong>Frequent / overlapping<br />launches</strong><small>Multiple campaigns moving at once</small></div><i>+</i><div><strong>Multi-channel<br />campaigns</strong><small>Social, email, paid, commerce</small></div><i>+</i><div><strong>Lean marketing<br />headcount</strong><small>People spanning responsibilities</small></div><i>=</i><div className="flow-icp-outcome"><strong>Potential<br />coordination pain</strong><small>Hypothesis to test</small></div></div>
        <div className="flow-icp-criteria"><p><b>Qualification signal</b> Complexity growing faster than marketing headcount.</p><p><b>Dependent objects</b> Products, creators, deliverables, assets, approvals, rights, and deadlines.</p><p><b>Existing environment</b> Commerce, creator tools, spreadsheets, storage, email / DMs, project tools, social, email/SMS, and ads.</p></div>
        <p className="flow-icp-footnote">Beauty, skincare, fashion, wellness, and other launch-driven consumer categories are useful examples, not an exclusive industry boundary. The individual tools may work. Someone still has to coordinate the workflow between them.</p>
      </section>

      <section className="flow-section flow-workflow">
        <SectionLabel number="04">Workflow analysis</SectionLabel>
        <div className="flow-section-heading flow-workflow-intro"><h2 className="display">How does a launch actually move through a lean marketing team?</h2><p>Products, creators, assets, and campaigns do not progress independently. Each creates dependencies that can determine whether a launch is actually ready.</p></div>
        <div className="flow-system-map" aria-label="Product, creator, asset, campaign, and launch relationship map">
          <div className="flow-system-kicker">Hypothesized relationship model</div>
          <div className="flow-object flow-object-product"><b>Product</b><small>SKU · variants · availability</small></div><div className="flow-object flow-object-launch"><b>Launch</b><small>deadline · required creative</small></div><div className="flow-object flow-object-campaign"><b>Campaign</b><small>brief · channels · dependencies</small></div><div className="flow-object flow-object-creator"><b>Creator</b><small>selection · collaboration</small></div><div className="flow-object flow-object-drop"><b>Drop</b><small>shipping · fulfillment</small></div><div className="flow-object flow-object-deliverable"><b>Deliverable</b><small>photo / video · version</small></div><div className="flow-object flow-object-asset"><b>Asset</b><small>intake · product association</small></div><div className="flow-object flow-object-approval"><b>Approval</b><small>review state</small></div><div className="flow-object flow-object-rights"><b>Usage rights</b><small>permission · terms</small></div><div className="flow-object flow-object-channel"><b>Channel</b><small>social · email · paid · commerce</small></div>
          <svg className="flow-system-links" viewBox="0 0 1200 610" preserveAspectRatio="none" aria-hidden="true"><path d="M140 150 H365 C440 150 440 130 495 130"/><path d="M185 425 H340 C390 425 390 360 470 360"/><path d="M570 130 C655 130 650 200 720 200"/><path d="M570 360 C645 360 650 310 720 310"/><path d="M790 200 V310"/><path d="M790 310 C865 310 860 400 930 400"/><path d="M790 200 C880 200 880 155 1010 155"/><path d="M1000 400 H1100"/><path d="M1080 155 C1115 155 1120 255 1120 310"/></svg>
        </div>
        <div className="flow-readiness flow-readiness-strip"><div><small>Concrete blocked-launch example</small><p>One unresolved dependency can block a launch.</p></div><ul><li className="is-ready">Product ready <b>✓</b></li><li className="is-ready">Creator deliverable <b>✓</b></li><li className="is-ready">Asset received <b>✓</b></li><li className="is-pending">Approval pending <b>!</b></li><li className="is-pending">Usage rights unresolved <b>!</b></li><li className="is-blocked">Paid campaign blocked <b>×</b></li></ul></div>
        <p className="flow-workflow-insight">A product can be ready for sale while its launch is operationally unready.</p>
        <div className="flow-workflow-scroll" aria-label="Hypothesized launch workflow">
          {workflowStages.map(([title, detail], index) => <div key={title} className={index === workflowStages.length - 1 ? "is-ready" : ""}><b>{String(index + 1).padStart(2, "0")}</b><strong>{title}</strong><small>{detail}</small>{index < workflowStages.length - 1 && <i aria-hidden="true">→</i>}</div>)}
        </div>
        <p className="flow-deeper-hypothesis">Marketing operations are not just a collection of tasks. They are a network of dependent objects and state changes.</p>
      </section>

      <section className="flow-section flow-assumptions">
        <SectionLabel number="05">Assumptions</SectionLabel>
        <div className="flow-section-heading"><h2 className="display">Uncertainty is part of the concept.</h2><p><Status kind="assumption">Assumptions to test</Status> These are not conclusions. They define what discovery needs to determine.</p></div>
        <div className="flow-risk-map" aria-label="Four qualitative assumptions to test through discovery research">
          <div className="flow-risk-map-intro"><span>Four assumptions to test</span><p>They differ in consequence and current evidence; this is a qualitative framing, not a scored chart.</p></div>
          <article className="flow-risk flow-risk-problem"><span>Problem assumption</span><p>Cross-tool launch coordination creates enough manual work, errors, delays, and status-checking to be meaningfully painful.</p></article>
          <article className="flow-risk flow-risk-user"><span>User assumption</span><p>The pain becomes particularly significant for lean DTC teams managing frequent or overlapping launches and campaigns.</p></article>
          <article className="flow-risk flow-risk-product"><span>Product assumption</span><p>Connecting existing specialist tools may be more useful than trying to replace them.</p></article>
          <article className="flow-risk flow-risk-automation"><span>Automation assumption</span><p>Teams may trust AI with low-risk operational work while retaining human approval for consequential actions.</p></article>
        </div>
        <div className="flow-risk-conclusion"><i aria-hidden="true">↓</i><div><Status kind="assumption">Highest-risk assumption</Status><p>Do these teams experience enough pain from cross-tool coordination to adopt a dedicated operational layer?</p><small>Unanswered. Primary research must determine this.</small></div></div>
      </section>

      <section className="flow-section flow-wedge">
        <SectionLabel number="06">Product wedge / prioritization</SectionLabel>
        <div className="flow-section-heading"><h2 className="display">The first concept was too broad to test.</h2><p>“AI marketing platform” gathered an enormous opportunity space. That is not an MVP or a useful validation question.</p></div>
        <div className="flow-narrowing">
          <div className="flow-opportunity-cloud"><span>Creator management</span><span>Creator PR</span><span>UGC intake</span><span>Asset management</span><span>Multimodal search</span><span>Usage rights</span><span>Campaign planning</span><span>Launch management</span><span>Analytics</span><span>Publishing</span><span>Content generation</span><span>AI agents</span><span>Brand memory</span><span>Operational memory</span></div>
          <div className="flow-narrowing-arrow" aria-hidden="true">↓<small>Prioritize by recurring work, clear state changes, dependencies, and cross-system coordination</small>↓</div>
          <div className="flow-wedge-result"><span>Testable wedge</span><h3 className="display"><span>Creator PR <i>→</i></span><span>Launch Operations</span></h3><p>Rather than building the entire marketing operating system, I would test whether Flow can own one painful workflow end-to-end.</p></div>
        </div>
        <ol className="flow-wedge-process" aria-label="Creator PR to launch operations state changes">{wedgeStages.map((stage, index) => <li key={stage}><b>{String(index + 1).padStart(2, "0")}</b><strong>{stage}</strong></li>)}</ol>
        <p className="flow-wedge-rationale"><strong>Why this wedge?</strong> Recurring <i>·</i> Cross-system <i>·</i> Observable state changes <i>·</i> Connected to launch readiness</p>
      </section>

      <section id="concept-exploration" className="flow-section flow-concepts">
        <SectionLabel number="07">Concept exploration</SectionLabel>
        <div className="flow-section-heading"><h2 className="display">Translating the hypothesis into product concepts</h2><p>Four product directions emerged from the workflow analysis. These are directions for future prototyping, not designed or tested solutions.</p></div>
        <div className="flow-concept-stage">
          <article><div className="flow-concept-title"><span>01</span><h3>Creator Portal</h3></div><div className="flow-behavior-diagram"><span>Creator</span><i>→</i><span>Submit info &amp; deliverables</span><i>→</i><strong>Flow</strong></div><p>Creators can provide shipping information, upload deliverables, and complete collaboration tasks without entering the brand’s internal workspace.</p></article>
          <article><div className="flow-concept-title"><span>02</span><h3>Silent Sync Listener</h3></div><div className="flow-behavior-diagram flow-behavior-sync"><span>Existing tools</span><i>→</i><span>Sync state</span><i>→</i><strong>Flow</strong></div><p>Synchronize relevant state from existing systems rather than requiring teams to recreate their entire operation inside Flow.</p></article>
          <article><div className="flow-concept-title"><span>03</span><h3>Operational AI</h3></div><div className="flow-behavior-diagram flow-behavior-ai"><span>State change</span><i>→</i><span>Detect blocker</span><i>→</i><strong>Coordinate next step</strong></div><p>Interpret state, surface blockers, connect related information, and prepare or execute low-risk coordination, not generic generation as the core differentiator.</p></article>
          <article><div className="flow-concept-title"><span>04</span><h3>Human Control</h3></div><div className="flow-behavior-diagram flow-behavior-control"><span>Proposed action</span><i>→</i><span>Human approval</span><i>→</i><strong>Execute</strong></div><p>Consequential actions retain appropriate review and approval points.</p></article>
        </div>
      </section>

      <section className="flow-section flow-principles">
        <SectionLabel number="08">Product principles</SectionLabel>
        <div className="flow-principle-line"><span>01</span><h3>Connect, don’t replace.</h3><p>Specialist tools can remain systems of record.</p></div>
        <div className="flow-principle-line"><span>02</span><h3>Operations before generation.</h3><p>Flow should not become another AI copy generator.</p></div>
        <div className="flow-principle-line"><span>03</span><h3>Human control over consequential actions.</h3><p>Automate repetitive coordination while preserving approval points.</p></div>
        <div className="flow-principle-line"><span>04</span><h3>Build operational memory.</h3><p>Represent relationships, history, rights, deadlines, and prior decisions.</p></div>
      </section>

      <section className="flow-section flow-research-plan">
        <SectionLabel number="09">Planned discovery research</SectionLabel>
        <div className="flow-section-heading"><h2 className="display">Before building, follow one recent launch from beginning to end.</h2><p><Status kind="planned">Planned research</Status> The next step is determining whether the problem exists strongly enough to justify the product.</p></div>
        <div className="flow-research-brief"><div><span>First study</span><strong>Interview approximately 5–8 people on lean DTC marketing teams with frequent launches or campaigns.</strong><p>Recruit across launch-driven consumer categories, not one industry, unless evidence later warrants narrowing.</p></div><blockquote>“Walk me through your most recent product launch.”</blockquote></div>
        <div className="flow-question-field"><span>Actual behavior to understand</span><p>Launch and campaign volume · ownership · tools involved · information locations · manual copying · creator coordination · deliverable and asset tracking · approvals · usage rights · delays · workarounds · status checks · automation trust and boundaries.</p><small>Not: “Would you use Flow?”</small></div>
      </section>

      <section className="flow-section flow-next">
        <SectionLabel number="10">Next steps</SectionLabel>
        <div className="flow-section-heading"><h2 className="display">The concept should change when the evidence does.</h2><p>A validation roadmap, not a delivery roadmap for a predetermined product.</p></div>
        <ol className="flow-roadmap"><li><b>01</b><div><strong>Interview</strong><span>Talk with 5–8 people matching the hypothesized ICP.</span></div></li><li><b>02</b><div><strong>Synthesize</strong><span>Map recurring problems, dependencies, handoffs, and workarounds.</span></div></li><li><b>03</b><div><strong>Re-evaluate ICP + wedge</strong><span>Test launch frequency, category, role, and whether Creator PR → Launch Operations is the right entry point.</span></div></li><li><b>04</b><div><strong>Prototype</strong><span>Design the smallest end-to-end workflow around the strongest validated problem.</span></div></li><li><b>05</b><div><strong>Test</strong><span>Run task-based usability testing.</span></div></li><li><b>06</b><div><strong>Iterate / build</strong><span>Refine the product model and build only what evidence supports.</span></div></li></ol>
      </section>
    </article>
  );
}
