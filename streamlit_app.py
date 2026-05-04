import streamlit as st
import time
import json
import re

st.set_page_config(page_title="Get Started", page_icon="🚀", layout="centered")

# ── session state defaults ────────────────────────────────────────────────────
for key, default in {
    "step": 1,
    "submitted": False,
    "name": "",
    "email": "",
    "company_name": "",
    "website_url": "",
    "plan": None,
}.items():
    if key not in st.session_state:
        st.session_state[key] = default

TOTAL_STEPS = 3
STEP_LABELS = ["Personal Info", "Company Details", "Plan Selection"]
PLANS = {
    "free":       {"label": "Free",       "price": "$0 / mo",  "desc": "For individuals getting started"},
    "starter":    {"label": "Starter",    "price": "$9 / mo",  "desc": "For freelancers and solo builders"},
    "pro":        {"label": "Pro",        "price": "$29 / mo", "desc": "For growing teams"},
    "enterprise": {"label": "Enterprise", "price": "$99 / mo", "desc": "For large organizations"},
}

# ── helpers ───────────────────────────────────────────────────────────────────
def is_valid_email(v: str) -> bool:
    return bool(re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", v))

def is_valid_url(v: str) -> bool:
    return bool(re.match(r"^https?://[^\s/$.?#].[^\s]*$", v))

def simulate_hubspot(data: dict) -> dict:
    time.sleep(1.5)
    return {"success": True, "payload": data}

# ── styles ────────────────────────────────────────────────────────────────────
st.markdown("""
<style>
div[data-testid="stMainBlockContainer"] { max-width: 520px; margin: auto; padding-top: 3rem; }
.step-bar { display: flex; align-items: flex-start; margin-bottom: 2rem; }
.step-node { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.step-circle {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 600;
}
.active   { background: #18181b; color: #fff; }
.complete { background: #18181b; color: #fff; }
.inactive { background: #f4f4f5; color: #a1a1aa; }
.step-label { font-size: 11px; font-weight: 500; white-space: nowrap; }
.label-active   { color: #18181b; }
.label-inactive { color: #a1a1aa; }
.connector { flex: 1; height: 1px; margin-top: 16px; }
.connector-done   { background: #18181b; }
.connector-undone { background: #e4e4e7; }
.plan-card {
    border: 1.5px solid #e4e4e7; border-radius: 12px;
    padding: 14px 16px; cursor: pointer; transition: border-color .15s;
    margin-bottom: 10px;
}
.plan-card.selected { border-color: #18181b; background: #fafafa; }
.plan-name  { font-weight: 600; font-size: 14px; color: #18181b; }
.plan-price { font-weight: 700; font-size: 16px; color: #18181b; }
.plan-desc  { font-size: 12px; color: #71717a; }
</style>
""", unsafe_allow_html=True)

# ── success screen ────────────────────────────────────────────────────────────
if st.session_state.submitted:
    st.markdown("""
    <div style="text-align:center; padding: 3rem 0;">
        <div style="font-size: 3rem;">✅</div>
        <h2 style="color:#18181b; margin-top:1rem;">You're all set!</h2>
        <p style="color:#71717a;">Your onboarding is complete. Welcome aboard.</p>
    </div>
    """, unsafe_allow_html=True)

    payload = {
        "name": st.session_state.name,
        "email": st.session_state.email,
        "companyName": st.session_state.company_name,
        "websiteUrl": st.session_state.website_url,
        "plan": st.session_state.plan,
    }
    with st.expander("Submitted payload (JSON)"):
        st.json(payload)
    st.stop()

# ── header ────────────────────────────────────────────────────────────────────
st.markdown("## Get started")
st.markdown("<p style='color:#71717a; margin-top:-12px;'>Complete the steps below to set up your account.</p>", unsafe_allow_html=True)

# ── step indicator ────────────────────────────────────────────────────────────
step = st.session_state.step
bar_html = '<div class="step-bar">'
for i, label in enumerate(STEP_LABELS):
    n = i + 1
    is_complete = step > n
    is_active = step == n
    circle_cls = "complete" if is_complete else ("active" if is_active else "inactive")
    label_cls = "label-active" if is_active else "label-inactive"
    icon = "✓" if is_complete else str(n)
    bar_html += f"""
    <div class="step-node">
        <div class="step-circle {circle_cls}">{icon}</div>
        <span class="step-label {label_cls}">{label}</span>
    </div>"""
    if i < TOTAL_STEPS - 1:
        conn_cls = "connector-done" if step > n else "connector-undone"
        bar_html += f'<div class="connector {conn_cls}"></div>'
bar_html += "</div>"
st.markdown(bar_html, unsafe_allow_html=True)

# ── step 1 ────────────────────────────────────────────────────────────────────
if step == 1:
    st.markdown("#### Personal Info")
    st.caption("Tell us a little about yourself.")
    name = st.text_input("Full Name", value=st.session_state.name, placeholder="Jane Smith")
    email = st.text_input("Email Address", value=st.session_state.email, placeholder="jane@example.com")

    if st.button("Next →", use_container_width=True, type="primary"):
        errors = []
        if not name.strip():
            errors.append("Name is required.")
        if not email.strip():
            errors.append("Email is required.")
        elif not is_valid_email(email.strip()):
            errors.append("Enter a valid email address.")
        if errors:
            for e in errors:
                st.error(e)
        else:
            st.session_state.name = name.strip()
            st.session_state.email = email.strip()
            st.session_state.step = 2
            st.rerun()

# ── step 2 ────────────────────────────────────────────────────────────────────
elif step == 2:
    st.markdown("#### Company Details")
    st.caption("Help us understand your organization.")
    company = st.text_input("Company Name", value=st.session_state.company_name, placeholder="Acme Inc.")
    website = st.text_input("Website URL", value=st.session_state.website_url, placeholder="https://acme.com")

    col1, col2 = st.columns(2)
    with col1:
        if st.button("← Previous", use_container_width=True):
            st.session_state.step = 1
            st.rerun()
    with col2:
        if st.button("Next →", use_container_width=True, type="primary"):
            errors = []
            if not company.strip():
                errors.append("Company name is required.")
            if not website.strip():
                errors.append("Website URL is required.")
            elif not is_valid_url(website.strip()):
                errors.append("Enter a valid URL (must start with http:// or https://).")
            if errors:
                for e in errors:
                    st.error(e)
            else:
                st.session_state.company_name = company.strip()
                st.session_state.website_url = website.strip()
                st.session_state.step = 3
                st.rerun()

# ── step 3 ────────────────────────────────────────────────────────────────────
elif step == 3:
    st.markdown("#### Choose a Plan")
    st.caption("Select the plan that fits your needs.")

    plan_options = list(PLANS.keys())
    plan_labels = [f"{v['label']} — {v['price']}" for v in PLANS.values()]
    current_idx = plan_options.index(st.session_state.plan) if st.session_state.plan else 0

    selected_label = st.radio(
        "Plan",
        options=plan_labels,
        index=current_idx,
        label_visibility="collapsed",
    )
    selected_plan = plan_options[plan_labels.index(selected_label)]

    desc = PLANS[selected_plan]["desc"]
    st.caption(f"_{desc}_")

    col1, col2 = st.columns(2)
    with col1:
        if st.button("← Previous", use_container_width=True):
            st.session_state.plan = selected_plan
            st.session_state.step = 2
            st.rerun()
    with col2:
        if st.button("Complete Onboarding", use_container_width=True, type="primary"):
            st.session_state.plan = selected_plan
            payload = {
                "name": st.session_state.name,
                "email": st.session_state.email,
                "companyName": st.session_state.company_name,
                "websiteUrl": st.session_state.website_url,
                "plan": selected_plan,
            }
            with st.spinner("Submitting…"):
                result = simulate_hubspot(payload)
            print("HubSpot submission payload:\n" + json.dumps(payload, indent=2))
            st.session_state.submitted = True
            st.rerun()
