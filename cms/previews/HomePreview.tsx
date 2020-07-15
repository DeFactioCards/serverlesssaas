import { ComponentType } from 'react';
import HeroSection from 'components/home/HeroSection';
import FeatureSection from 'components/home/FeatureSection';
import StepsSection from 'components/home/StepsSection';
import TeamSection from 'components/home/TeamSection';
import PricingSection from 'components/home/PricingSection';

const HomePreview: ComponentType<any> = ({ entry, widgetsFor }) => {
  const features = [];
  widgetsFor('features').map((feature) => {
    if (feature) {
      features.push({
        name: feature?.getIn(['data', 'name']),
        description: feature?.getIn(['data', 'description']),
      });
    }
  });

  const steps = [];
  widgetsFor('steps').map((step) => {
    steps.push({
      name: step?.getIn(['data', 'name']),
      description: step?.getIn(['data', 'description']),
    });
  });

  const plans = [];
  widgetsFor('plans').map((plan) => {
    const usps = [];
    widgetsFor('plan.usps').map((usp) => {
      plans.push({
        name: usp?.getIn(['data', 'name']),
      });
    });

    plans.push({
      name: plan?.getIn(['data', 'name']),
      description: plan?.getIn(['data', 'description']),
      price: plan?.getIn(['data', 'price']),
      usps: plan?.getIn(['data', 'usps']),
    });
  });

  const team = [];
  widgetsFor('team').map((member) => {
    team.push({
      name: member?.getIn(['data', 'name']),
      description: member?.getIn(['data', 'description']),
      position: member?.getIn(['data', 'position']),
      image: member?.getIn(['data', 'image']),
    });
  });

  return (
    <>
      <HeroSection
        title={entry.getIn(['data', 'hero_title'])}
        description={entry.getIn(['data', 'hero_description'])}
        image={entry.getIn(['data', 'hero_image'])}
      />
      <FeatureSection
        title={entry.getIn(['data', 'feature_title'])}
        description={entry.getIn(['data', 'feature_description'])}
        features={features}
      />
      <StepsSection
        image={entry.getIn(['data', 'steps_image'])}
        steps={steps}
      />
      <PricingSection
        title={entry.getIn(['data', 'pricing_title'])}
        description={entry.getIn(['data', 'pricing_description'])}
        plans={plans}
      />
      <TeamSection
        title={entry.getIn(['data', 'team_title'])}
        description={entry.getIn(['data', 'team_description'])}
        team={team}
      />
    </>
  );
};

export default HomePreview;
