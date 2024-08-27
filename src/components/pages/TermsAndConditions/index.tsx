import { ReactElement } from 'react';

import FullPageContainer from '@layouts/containers/fullPageContainer';
import GudPplIcon from '@ui/icons/GudPplIcon';
import { styled } from '@ui/theme';
import { Typography, Link } from '@ui/typography';
import { Grid } from '@ui/layout';

export default function TermsAndConditions(): ReactElement {
  const Heading = styled(Typography)({
    display: 'flex',
    fontSize: '1.54em',
    fontWeight: 600,
    justifyContent: 'center',
    paddingBottom: 20,
  });
  const SubHeading = styled(Typography)({
    fontSize: '1em',
    fontWeight: 600,
    paddingTop: 20,
    paddingBottom: 20,
  });
  const Paragraph = styled(Typography)({
    fontSize: '1em',
    fontWeight: 400,
    lineHeight: '24px',
    paddingTop: 10,
    paddingBottom: 10,
  });
  const List = styled('ul')({
    paddingBottom: 10,
  });
  const ListItem = styled('li')({
    padding: '2px',
  });

  return (
    <FullPageContainer
      logo={<GudPplIcon width={115} height={40} />}
      content={
        <Grid container spacing={2} flexDirection={'column'} marginLeft={10} marginRight={10}>
          <Heading>Privacy Policy, Terms & Conditions</Heading>
          <SubHeading>General</SubHeading>
          <Paragraph>
            The use of this website{' '}
            <Link href="https://help.gudppl.com" underline="hover">
              www.gudppl.com
            </Link>{' '}
            or any of its possible sub-sites and gudppl mobile apps (hereinafter the "Platform"), including downloading
            any material from the Platform, is governed by the terms and conditions and privacy statement (hereinafter
            the "Privacy Statement") below (hereinafter jointly referred to as the "Terms and Conditions"). Your
            continued use of this Platform constitutes your acknowledgment that you have read the Terms and Conditions,
            that you agree to comply with and be bound by them, and that, when the Platform indicates that they have
            been or will be amended, you will review those amendments. Please read these Terms of Use carefully, as they
            set forth obligations and include limitations on legal rights.
          </Paragraph>

          <SubHeading>0.1 Gudppl “DOs” and “DON’Ts.</SubHeading>
          <SubHeading>0.1.1. Dos. You agree that you will:</SubHeading>
          <List>
            <ListItem>
              Comply with all applicable laws, including, without limitation, privacy laws, intellectual property laws,
              anti-spam laws, export control laws, tax laws, and regulatory requirements;
            </ListItem>
            <ListItem>Provide accurate information to us and keep it updated;</ListItem>
            <ListItem>Use your real name on your profile;</ListItem>
            <ListItem>Use the Services in a professional manner.</ListItem>
          </List>

          <SubHeading>0.1.2. Don'ts. You agree that you will not:</SubHeading>
          <List>
            <ListItem>
              Act dishonestly or unethically, including by posting inappropriate, inaccurate, or objectionable content;
            </ListItem>
            <ListItem>
              Add content that is not intended for, or inaccurate for, a designated field (e.g. submitting a telephone
              number in the “title” or any other field, or including telephone numbers, email addresses, street
              addresses or any personally identifiable information for which there is not a field provided by gudppl);
            </ListItem>
            <ListItem>Use an image that is not your likeness or a head-shot photo for your profile;</ListItem>
            <ListItem>Create a false identity on gudppl;</ListItem>
            <ListItem>Misrepresent your identity, including but not limited to the use of a pseudonym;</ListItem>
            <ListItem>Create a User profile for anyone other than yourself (a real person);</ListItem>
            <ListItem>Use or attempt to use another's account;</ListItem>
            <ListItem>Harass, abuse or harm another person;</ListItem>
            <ListItem>Send spam or other unwelcomed communications to others;</ListItem>
            <ListItem>
              Scrape or copy profiles and information of others through any means (including crawlers, browser plugins
              and add-ons, and any other technology or manual work);
            </ListItem>
            <ListItem>
              Act in an unlawful, libelous, abusive, obscene, discriminatory or otherwise objectionable manner;
            </ListItem>
            <ListItem>
              Disclose information that you do not have the right to disclose (such as confidential information of
              others (including your employer));
            </ListItem>
            <ListItem>
              Violate intellectual property rights of others, including patents, trademarks, trade secrets, copyrights
              or other proprietary rights;
            </ListItem>
            <ListItem>
              Violate the intellectual property or other rights of gudppl, including, without limitation, using the word
              “gudppl” or our logos in any business name, email, or URL except as provided in the Brand Guidelines
            </ListItem>
            <ListItem>
              Post any unsolicited or unauthorized advertising, “junk mail,” “spam,” “chain letters,” “pyramid schemes,”
              or any other form of solicitation unauthorized by Gudppl;
            </ListItem>
            <ListItem>Send messages to distribution lists, newsgroup aliases, or group aliases;</ListItem>
            <ListItem>Post anything that contains software viruses, worms, or any other harmful code;</ListItem>
            <ListItem>
              Manipulate identifiers in order to disguise the origin of any message or post transmitted through the
              Services;
            </ListItem>
            <ListItem>Creating or operate a pyramid scheme, fraud or other similar practice;</ListItem>
            <ListItem>
              Copy or use the information, content or data of others available on the Services (except as expressly
              authorized);
            </ListItem>
            <ListItem>
              Copy or use the information, content or data on gudppl in connection with a competitive service (as
              determined by gudppl);
            </ListItem>
            <ListItem>
              Copy, modify or create derivative works of gudppl, the Services or any related technology (except as
              expressly authorized by gudppl);
            </ListItem>
            <ListItem>
              Reverse engineer, decompile, disassemble, decipher or otherwise attempt to derive the source code for the
              Services or any related technology, or any part thereof;
            </ListItem>
            <ListItem>
              Imply or state that you are affiliated with or endorsed by gudppl without our express consent (e.g.,
              representing yourself as an accredited gudppl representative);
            </ListItem>
            <ListItem>
              Rent, lease, loan, trade, sell/re-sell access to the Services or related any information or data;
            </ListItem>
            <ListItem>
              Sell, sponsor, or otherwise monetize a gudppl Group or any other feature of the Services, without gudppl's
              consent;
            </ListItem>
            <ListItem>
              Deep-link to our Services for any purpose other than to promote your profile or a Group on gudppl (as set
              forth in the Brand Guidelines without gudppl's consent;
            </ListItem>
            <ListItem>
              Remove any copyright, trademark or other proprietary rights notices contained in or on our Service;
            </ListItem>
            <ListItem>Remove, cover or obscure any advertisement included on the Services;</ListItem>
            <ListItem>
              Collect, use, copy, or transfer any information obtained from gudppl without the consent of gudppl;
            </ListItem>
            <ListItem>Share or disclose information of others without their express consent;</ListItem>
            <ListItem>
              Use manual or automated software, devices, scripts robots, other means or processes to access, “scrape,”
              “crawl” or “spider” the Services or any related data or information;
            </ListItem>
            <ListItem>
              Use bots or other automated methods to access the Services, add or download contacts, send or redirect
              messages;
            </ListItem>
            <ListItem>
              Monitor the Services' availability, performance or functionality for any competitive purpose;
            </ListItem>
            <ListItem>
              Engage in “framing,” “mirroring,” or otherwise simulating the appearance or function of the Services;
            </ListItem>
            <ListItem>
              Access the Services except through the interfaces expressly provided by gudppl, such as its mobile
              applications
            </ListItem>
            <ListItem>Override any security feature of the Services;</ListItem>
            <ListItem>
              Interfere with the operation of, or place an unreasonable load on, the Services (e.g., spam, denial of
              service attack, viruses, gaming algorithms); and/or
            </ListItem>
          </List>
          <SubHeading>Terms of Use</SubHeading>
          <SubHeading>Purpose of the platform</SubHeading>
          <Paragraph>
            GUDPPL (PVT) Ltd. hereinafter is referred as “gudppl”. The platform is designed for users of{' '}
            <a href="https://help.gudppl.com" target="_blank">
              Gudppl
            </a>{' '}
            to easily find volunteer opportunities, create volunteer opportunities and track/log their volunteer hours.
            The primary purpose of the Platform is to connect people who want to Volunteer with those who need
            Volunteers to make a positive meaningful impact in the world. You may browse, distribute and comment on the
            content of the Platform, provided you comply with these Terms and Conditions and all applicable law. User
            Agreement Welcome, and thanks for using{' '}
            <a href="https://help.gudppl.com" target="_blank">
              Gudppl
            </a>{' '}
            and/or other gudppl services. When you use our products and services, you're agreeing to our terms, so
            please take a few minutes to read over the User Agreement below. Note: You are entering into a legally
            binding agreement.
          </Paragraph>
          <SubHeading>1. Introduction:</SubHeading>
          <Paragraph> revised on October 6, 2016</Paragraph>
          <List>
            <ListItem>Purpose</ListItem>
          </List>
          <Paragraph>
            We are a social network and online platform for volunteers. Our mission is to connect people who want to
            Volunteer with those who need Volunteers. Our platform is designed to promote, inspire and recognize
            volunteerism to make a positive meaningful impact in the world.
          </Paragraph>
          <SubHeading>1.2. Agreement</SubHeading>
          <List>
            <ListItem>
              When you use our platform,{' '}
              <b>
                you are entering into a legal agreement and you agree to all of these terms. You also agree to our
                Privacy Policy, which covers how we collect, use, share, and store your personal information.
              </b>
            </ListItem>
            <ListItem>
              You agree that by clicking “Join gudppl” “Register Organization” “Join Now” “Sign Up” or similar,
              registering, accessing or using our services you are entering into a legally binding agreement (even if
              you are using our Services on behalf of an Organization
            </ListItem>
            <ListItem>
              This “Agreement” includes this User Agreement and the Privacy Policy, and other terms that will be
              displayed to you at the time you first use certain features (such as creating an “Opportunity”), as may be
              amended by gudppl from time to time. If you do not agree to this Agreement, do NOT click “Join Now” (or
              similar) and do not access or otherwise use any of our Services or the platform
            </ListItem>
            <ListItem>
              Registered users of our Services and platform are “Users” and unregistered users are “Visitors”. This
              Agreement applies to both.
            </ListItem>
          </List>
          <SubHeading>2. Obligations</SubHeading>
          <Paragraph>2.1. Service Eligibility</Paragraph>
          <List>
            <ListItem>Here are some promises you make to us in this Agreement:</ListItem>
            <ListItem>
              You're eligible to enter into this Agreement and you are at least our “Minimum Age.” To use the platform
              and/or Services, you agree that: (1) you must be the “Minimum Age” (defined below) or older; (2) you will
              only have one gudppl account, which must be in your real name; and (3) you are not already restricted by
              gudppl from using the Services. This “Agreement” includes this User Agreement and the Privacy Policy, and
              other terms that will be displayed to you at the time you first use certain features (such as creating an
              “Opportunity”), as may be amended by gudppl from time to time. If you do not agree to this Agreement, do
              NOT click “Join Now” (or similar) and do not access or otherwise use any of our Services or the platform
              “Minimum Age” means - 13 years old or as per the minimum age requirement as per your residing country.
              However, if law in your respective country indicates that you must be older in order for Gudppl to
              lawfully provide the Services to you (including the collection, storage and use of your information) then
              the Minimum Age in such country will be consider as older age. The Services are not for use by anyone
              under the age of 13.
            </ListItem>
          </List>
          <Paragraph>2.2. Your User account</Paragraph>
          <Paragraph>You'll keep your password a secret.</Paragraph>
          <Paragraph>You will not share an account with anyone else and will follow our rules and the law.</Paragraph>
          <Paragraph>
            As between you and others, your account belongs to you. You agree to: (1) try to choose a strong and secure
            password; (2) keep your password secure and confidential; (3) follow the law, Honour Code and the Dos and
            Don'ts below. You are responsible for anything that happens through your account unless you close it or
            report misuse.
          </Paragraph>
          <Paragraph>2.3. Notices and Service Messages</Paragraph>
          <List>
            <ListItem>
              You're okay with us using our website and email to provide you with important notices. This Agreement
              applies to mobile applications as well. If the contact information you provide isn't up to date, you may
              miss out on these notices. You agree that we may provide notices to you in the following ways: (1) a
              banner notice on the Service, or (2) an email sent to an address you provided, or (3) through other means
              including mobile number, telephone, or mail. You agree to keep your contact information to date.
            </ListItem>
          </List>
          <SubHeading>3. Rights and Limits</SubHeading>
          <Paragraph>3.1. Your License to Gudppl</Paragraph>
          <List>
            <ListItem>
              You own all of the content, feedback, and personal information you provide to us,
              <b> but you also grant us a non-exclusive license to it.</b>
            </ListItem>
            <ListItem>
              You're eligible to enter into this Agreement and you are at least our “Minimum Age.” To use the platform
              and/or Services, you agree that: (1) you must be the “Minimum Age” (defined below) or older; (2) you will
              only have one gudppl account, which must be in your real name; and (3) you are not already restricted by
              gudppl from using the Services.
            </ListItem>
            <ListItem>We'll honour the choices you make about who gets to see your information and content.</ListItem>
            <ListItem>
              You promise to only provide information and content that you have the right to share, and that your gudppl
              profile will be truthful.
            </ListItem>
            <ListItem>
              As between you and gudppl, you own the content and information that you submit or post to the Services and
              you are only granting gudppl the following non-exclusive license: A worldwide, transferable and
              sub-licensable right to use, copy, modify (i.e: edit opportunity details if the organizer requests it, to
              assist with smooth operation of the event), distribute, publish, and process, information and content that
              you provide through our Services, without any further consent, notice and/or compensation to you or
              others. These rights are limited in the following ways:
            </ListItem>
            <ListItem>
              <ListItem>
                You can end this license for specific content by deleting such content from the Services, or generally
                by closing your account, except (a) to the extent you shared it with others as part of the Service and
                they copied or stored it and (b) for the reasonable time it takes to remove from backup and other
                systems.
              </ListItem>
              <ListItem>
                We will not include your content in advertisements for the products and services of others (including
                sponsored content) to others without your separate consent. However, we have the right, without
                compensation to you or others, to serve ads near your content and information, and your comments on
                sponsored content may be visible as noted in the Privacy Policy.
              </ListItem>
              <ListItem>
                We will get your consent if we want to give others the right to publish your posts beyond the Service.
                However, other Users and/or Visitors may access and share your content and information, consistent with
                your settings and degree of connection with them.
              </ListItem>
              <ListItem>
                While we may edit and make formatting changes to your content (such as translating it, modifying the
                size, layout or file type or removing metadata), we will not modify the meaning of your expression.
              </ListItem>
              <ListItem>
                Because you own your content and information and we only have non-exclusive rights to it, you may choose
                to make it available to others, including under the terms of a Creative Commons license.
              </ListItem>
            </ListItem>
            <ListItem>
              You agree that we may access, store and use any information that you provide in accordance with the terms
              of the Privacy Policy and your privacy settings. By submitting suggestions or other feedback regarding our
              Services to gudppl, you agree that gudppl can use and share (but does not have to) such feedback for any
              purpose without compensation to you. You agree to only provide content or information if that does not
              violate the law nor anyone's rights (e.g., without violating any intellectual property rights or breaching
              a contract). You also agree that your profile information will be truthful. gudppl may be required by law
              to remove certain information or content in certain countries.
            </ListItem>
          </List>
          <Paragraph>3.2. Service Availability</Paragraph>
          <List>
            <ListItem>
              We may change or discontinue any of our Services. We can't promise to store or keep showing any
              information and content you've posted.
            </ListItem>
            <ListItem>
              We may change, suspend or end any Service, or change and modify prospectively in our discretion. To the
              extent allowed under law, these changes may be effective upon notice provided to you.
            </ListItem>
            <ListItem>
              gudppl is not a storage service. You agree that we have no obligation to store, maintain or provide you a
              copy of any content or information that you or others provide, except to the extent required by applicable
              law and as noted in Section 3.1 of our Privacy Policy
            </ListItem>
          </List>
          <Paragraph>3.3. Other Content, Sites and apps</Paragraph>
          <List>
            <ListItem>
              When you see or use others' content and information posted on our Services, it's at your own risk.
            </ListItem>
            <ListItem>
              Third parties may offer their own products and services through gudppl, and we aren't responsible for
              those third-party activities.
            </ListItem>
            <ListItem>
              By using the Services, you may encounter content or information that might be inaccurate, incomplete,
              delayed, misleading, illegal, offensive or otherwise harmful. gudppl generally does not review content
              provided by our Users. You agree that we are not responsible for third parties' (including other Users')
              content or information or for any damages as result of your use of or reliance on it.
            </ListItem>
            <ListItem>
              You are responsible for deciding if you want to access or use third party apps or sites that link from our
              Services. If you allow a third party app or site to authenticate you or connect with your gudppl account,
              that app or site can access information on Gudppl related to you and your connections. Third party apps
              and sites have their own legal terms and privacy policies, and you may be giving others permission to use
              your information in ways we would not. Except to the limited extent it may be required by applicable law,
              gudppl is not responsible for these other sites and apps -- use these at your own risk.
            </ListItem>
          </List>
          <Paragraph>3.4. Limits</Paragraph>
          <List>
            <ListItem>
              We have the right to limit how you connect and interact on our Services. We're providing you notice about
              our intellectual property rights.
            </ListItem>
            <ListItem>
              gudppl reserves the right to limit your use of the Services. gudppl reserves the right to restrict,
              suspend, or terminate your account if Gudppl believes that you may be in breach of this Agreement or law
              or are misusing the Services (e.g. violating Honour Code).
            </ListItem>
            <ListItem>
              gudppl reserves all of its intellectual property rights in the Services. For example, gudppl, gudppl
              (stylized), logos and other gudppl trademarks, service marks, graphics, and logos used in connection with
              gudppl are trademarks or registered trademarks of gudppl. Other trademarks and logos used in connection
              with the Services may be the trademarks of their respective owners.
            </ListItem>
          </List>

          <SubHeading>4. Disclaimer and Limit of Liability</SubHeading>
          <Paragraph>4.1. No Warranty</Paragraph>
          <List>
            <ListItem>
              This is our disclaimer of legal liability for the quality, safety, or reliability of our Services.
            </ListItem>
            <ListItem>
              TO THE EXTENT ALLOWED UNDER LAW, GUDPPL (AND THOSE THAT GUDPPL WORKS WITH TO PROVIDE THE SERVICES) (A)
              DISCLAIM ALL IMPLIED WARRANTIES AND REPRESENTATIONS (E.G. WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
              PARTICULAR PURPOSE, ACCURACY OF DATA, AND NONINFRINGEMENT); (B) DO NOT GUARANTEE THAT THE SERVICES WILL
              FUNCTION WITHOUT INTERRUPTION OR ERRORS, AND (C) PROVIDE THE SERVICE (INCLUDING CONTENT AND INFORMATION)
              ON AN “AS IS” AND “AS AVAILABLE” BASIS.
            </ListItem>
            <ListItem>
              SOME LAWS DO NOT ALLOW CERTAIN DISCLAIMERS, SO SOME OR ALL OF THESE DISCLAIMERS MAY NOT APPLY TO YOU.
            </ListItem>
          </List>

          <Paragraph>4.2. Exclusion of Liability</Paragraph>
          <List>
            <ListItem>These are the limits of legal liability we may have to you.</ListItem>
            <ListItem>
              TO THE EXTENT PERMITTED UNDER LAW (AND UNLESS GUDPPL HAS ENTERED INTO A SEPARATE WRITTEN AGREEMENT THAT
              SUPERSEDES THIS AGREEMENT), GUDPPL (AND THOSE THAT GUDPPL WORKS WITH TO PROVIDE THE SERVICES) SHALL NOT BE
              LIABLE TO YOU OR OTHERS FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, OR ANY
              LOSS OF DATA, OPPORTUNITIES, REPUTATION, PROFITS OR REVENUES, RELATED TO THE SERVICES (E.G. OFFENSIVE OR
              DEFAMATORY STATEMENTS, DOWN TIME OR LOSS, USE OR CHANGES TO YOUR INFORMATION OR CONTENT).
            </ListItem>
            <ListItem>
              IN NO EVENT SHALL THE LIABILITY OF GUDPPL (AND THOSE THAT GUDPPL WORKS WITH TO PROVIDE THE SERVICES)
              EXCEED, IN THE AGGREGATE FOR ALL CLAIMS, AN AMOUNT THAT IS THE LESSER OF (A) FIVE TIMES THE MOST RECENT
              MONTHLY OR YEARLY FEE THAT YOU PAID FOR A PREMIUM SERVICE, IF ANY.
            </ListItem>
            <ListItem>
              THIS LIMITATION OF LIABILITY IS PART OF THE BASIS OF THE BARGAIN BETWEEN YOU AND GUDPPL AND SHALL APPLY TO
              ALL CLAIMS OF LIABILITY (E.G. WARRANTY, TORT, NEGLIGENCE, CONTRACT, LAW) AND EVEN IF GUDPPL HAS BEEN TOLD
              OF THE POSSIBILITY OF ANY SUCH DAMAGE, AND EVEN IF THESE REMEDIES FAIL THEIR ESSENTIAL PURPOSE.
            </ListItem>
          </List>
          <SubHeading>5. Termination</SubHeading>
          <List>
            <ListItem>We can each end this Agreement anytime we want.</ListItem>
            <ListItem>
              gudppl or You may terminate this Agreement at any time with notice to the other. On termination, you lose
              the right to access or use the Services. The following shall survive termination:
              <List>
                <ListItem>Our rights to use and disclose your feedback;</ListItem>
                <ListItem>
                  Users' and/or Visitors' rights to further re-share content and information you shared through the
                  Service to the extent copied or re-shared prior to termination;
                </ListItem>
              </List>
            </ListItem>
            <ListItem>You can contact us to learn how to close your gudppl account.</ListItem>
          </List>
          <SubHeading>6. Dispute Resolution</SubHeading>

          <List>
            <ListItem>
              Disputes resolution will take place at the country of origin and the laws of the country of origin will
              apply and shall first be negotiated, thereafter failing will go to litigation.
            </ListItem>
          </List>

          <SubHeading>7. General Terms</SubHeading>
          <List>
            <ListItem>Here are some important details about how to read the Agreement.</ListItem>
            <ListItem>
              To the extent allowed by law, the English version of this Agreement is binding and other translations are
              for convenience only. This Agreement (including additional terms that may be provided by us when you
              engage with a feature of the Services) is the only agreement between us regarding the Services and
              supersedes all prior agreements for the Services.
            </ListItem>
            <ListItem>
              If we don't act to enforce a breach of this Agreement, that does not mean that Gudppl has waived its right
              to enforce this Agreement. You may not assign or transfer this Agreement (or your user account or use of
              Services) to anyone without our consent. However, you agree that gudppl may assign this Agreement to its
              affiliates or a party that buys it without your consent. There are no third party beneficiaries to this
              Agreement.
            </ListItem>
            <ListItem>
              We reserve the right to change the terms of this Agreement and will provide you notice if we do and we
              agree that changes cannot be retroactive. If you don't agree to these changes, you must stop using the
              Services.
            </ListItem>
            <ListItem>
              You agree that the only way to provide us legal notice is at the addresses provided in Section 10.
            </ListItem>
          </List>

          <SubHeading>8. Objectionable Content</SubHeading>
          <Paragraph>
            We are creating a platform that promotes positivity and celebrates good deeds. So, any content that might
            hinder or negatively impact this purpose, will be removed without further notification. If you are in doubt
            about the content that you are about to post, please contact the gudppl team for guidance to clarify.
          </Paragraph>
          <Paragraph>
            Furthermore, when such content is posted User profiles will be blocked immediately and the matter will be
            investigated. During the investigation you will not have access to your profile and the objectionable
            content posted will be removed.
          </Paragraph>
          <Paragraph>
            Want further clarification to better understand what is considered as harmful? So here are some examples
            that we will not tolerate:
          </Paragraph>
          <List>
            <ListItem>1. Content promoting violence or terrorism graphic or otherwise</ListItem>
            <ListItem>2. Hate speech</ListItem>
            <ListItem>3. Insensitive, disrespectful and cruel content</ListItem>
            <ListItem>4. Nudity, other pornographic content or sexual solicitation</ListItem>
          </List>
          <Paragraph>
            Be <b>nice</b> to each other, let’s build an honest, accountable and respectful community.
          </Paragraph>
          <SubHeading>9. Complaints Regarding Content</SubHeading>
          <List>
            <ListItem>
              We respect the intellectual property rights of others. We require that information posted by Users be
              accurate and not in violation of the intellectual property rights or other rights of third parties. We
              provide a policy and process for complaints concerning content posted by our Users.
            </ListItem>
          </List>
          <SubHeading>10. How To Contact Us</SubHeading>
          <List>
            <ListItem>
              If you want to get in touch with us, please email to{' '}
              <a href="mailto:ask@gudppl.com" target="_blank">
                ask@gudppl.com
              </a>
            </ListItem>
          </List>
        </Grid>
      }
    />
  );
}
