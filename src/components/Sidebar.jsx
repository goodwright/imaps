import React, { useContext }  from "react";
import { Link, useLocation } from "react-router-dom";
import UserSummary from "./UserSummary";
import { UserContext } from "../contexts";
import yourCollectionsIcon from "../images/your-collections.svg"
import collectionsIcon from "../images/collections.svg"
import newItemIcon from "../images/new.svg"
import gearIcon from "../images/gear.svg"
import goodwright from "../images/goodwright.svg";
import pekaIcon from "../images/peka.svg";
import goodwrightIcon from "../images/goodwright-icon.svg";
import githubIcon from "../images/github.svg"
import slackIcon from "../images/slack.svg";
import documentationIcon from "../images/documentation.svg";
import searchIcon from "../images/searchIcon.svg"

const Sidebar = () => {

  const [user,] = useContext(UserContext);

  const pathname = useLocation().pathname;

  const linkSections = [{
    name: "",
    links: [{
      text: "Public Collections", href: "/collections/", img: collectionsIcon
    }, {
      text: "Your Collections", href: "/user-collections/", img: yourCollectionsIcon
    }, {
      text: "+ New Collection", href: "/collections/new/", img: newItemIcon
    }, {
      text: "Run Analysis", href: "/analysis/", img: gearIcon
    }, {
      text: "Advanced Search", href: "/search/", img: searchIcon
    }]
  }, {
    name: "Applications",
    links: [{
      text: "PEKA", href: "/apps/peka/", img: pekaIcon
    }],
  }, {
    name: "Resources",
    links: [{
      text: "CLIP forum", href: "https://docs.imaps.goodwright.org/", img: documentationIcon
    }, {
      text: "Slack Workspace", href: "https://join.slack.com/t/imapsgroup/shared_invite/zt-r24y3591-Xbhnym2t38u_urU~I0K0lQ", img: slackIcon
    }]
  }]

  if (!user) linkSections[0].links.splice(1, 3)

  return (
    <div className="areas-sidebar no-scroll flex flex-col items-center justify-between overflow-y-scroll sm:px-3">
      <div className="flex flex-col items-center sm:items-start w-full">
        <UserSummary user={user || null} link={Boolean(user)} size={8} sm={12} noGap={Boolean(user)} className="border-b py-3 w-full">
          {user ? (
            <div className="text-primary-300 sm:mx-auto hover:text-primary-500 hidden sm:block sm:ml-2">
              <div className="">{user.name}</div>
              <div className="text-xs text-primary-200">{user.username}</div>
            </div>
          ) : <div className="text-primary-200">Guest</div>}
        </UserSummary>

        {user && user.memberships.length > 0 && (
          <div className="hidden text-xs border-b py-3 sm:block w-full">
            <div className="font-bold mb-2">Your groups:</div>
            <div className="grid gap-1">
              {user.memberships.map(group => (
                <Link to={`/@${group.slug}/`} key={group.id} className="text-primary-200">
                  <span className="at">@</span>{group.slug}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-8 mt-6 w-full pr-2">
          {linkSections.map(section => (
            <div className="w-full">
              {section.name && <div className="hidden w-full font-bold text-xs mb-1 pr-2 text-right sm:block sm:justify-end">{section.name}</div>}
              <div className="grid gap-5 items-center w-full sm:text-right sm:gap-px">
                {section.links.map(link => {
                  const Element = link.href.slice(0, 4) === "http" ? "a" : Link;
                  const selected = pathname === link.href;
                  return (
                    <Element className={`inline-flex justify-center w-full px-2 py-2 ml-auto rounded sm:w-max hover:no-underline ${selected ? "bg-gray-200" : ""}`} to={link.href} href={link.href}>
                      <span className={`hidden sm:inline text-primary-100 hover:text-primary-500 ${selected ? "text-primary-500" : ""}`}>{link.text}</span>
                      <img src={link.img} alt="public-collections" className="block w-2/3 mr-0 opacity-90 hover:opacity-100 sm:hidden" />
                    </Element>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-2/3 pb-3 sm:w-full mt-5">
        <a href="https://goodwright.org" className="block mb-3 opacity-90 hover:opacity-100 sm:mb-1">
          <img src={goodwright} alt="goodwright" className="hidden sm:block mx-auto w-28"/>
          <img src={goodwrightIcon} alt="goodwright-icon" className="block w-full sm:hidden" />
        </a>
        <div className="text-2xs grid text-center sm:flex sm:whitespace-nowrap sm:justify-center sm:mb-3">
          <Link className="text-primary-200 sm:pr-1" to="/privacy/">Privacy<span className="hidden text-primary-00 sm:inline"> Policy</span></Link>
          <Link className="text-primary-200 sm:pl-1" to="/terms/">Terms<span className="hidden sm:inline"> of Use</span></Link>
        </div>
        <div className="hidden sm:grid gap-2 mx-auto w-max">
          <a href="https://github.com/goodwright/imaps-api" className="flex text-primary-200 text-xs items-center"><img className="mr-1 w-5" src={githubIcon} alt="github" /> Backend code</a>
          <a href="https://github.com/goodwright/imaps" className="flex text-primary-200 text-xs items-center"><img className="mr-1 w-5" src={githubIcon} alt="github" /> Frontend code</a>
        </div>
      </div>
{/* 
      <div className="sidebar-top">

        <div className="nav-links">
          {user ? (
            <>
              <Link className={onCollectionsPage ? "selected" : ""} to="/collections/">
                <span className="full">Public Collections</span>
                <img src={collectionsIcon} alt="public-collections" className="mini" />
              </Link>
              <Link className={onUserCollectionsPage ? "selected" : ""} to="/user-collections/">
                <span className="full">Your Collections</span>
                <img src={yourCollectionsIcon} alt="your-collections" className="mini" />
              </Link>
              <Link className={onNewCollectionPage ? "selected" : ""} to="/collections/new/">
                <span className="full">+ New Collection</span>
                <img src={newItemIcon} alt="new-collection" className="mini" />
              </Link>
              <Link className={onAnalysisPage ? "selected" : ""} to="/analysis/">
                <span className="full">Run Analysis</span>
                <img src={gearIcon} alt="run-analysis" className="mini" />
              </Link>
            </>
          ) : (
            <>
              <Link className={onCollectionsPage ? "selected" : ""} to="/collections/">
                <span className="full">Collections</span>
                <img src={collectionsIcon} alt="collections" className="mini" />
              </Link>
            </>
          )}
          <Link className={onSearchPage ? "selected" : ""} to="/search/">
            <span className="full">Search Data</span>
            <img src={searchIcon} alt="search" className="mini" />
          </Link>
          <div className="applications">
            <div className="heading">Applications</div>
            <Link className={onPekaPages ? "selected" : ""} to="/apps/peka/">
              <span className="full">PEKA</span>
              <img src={pekaIcon} alt="peka" className="mini" />
            </Link>
          </div>

          <div className="applications">
            <div className="heading">Resources</div>
            <a href="https://docs.imaps.goodwright.org/">
              <span className="full">CLIP forum</span>
              <img src={documentationIcon} alt="peka" className="mini" />
            </a>
            <a href="https://join.slack.com/t/imapsgroup/shared_invite/zt-r24y3591-Xbhnym2t38u_urU~I0K0lQ">
              <span className="full">Slack Workspace</span>
              <img src={slackIcon} alt="peka" className="mini" />
            </a>
          </div>
        </div>
      </div>
 */}
      {/* <div className="goodwright">
        <a href="https://goodwright.org">
          <img src={goodwright} alt="goodwright" className="goodwright-logo"/>
          <img src={goodwrightIcon} alt="goodwright-icon" className="goodwright-icon" />
        </a>
        <div className="links">
          <Link to="/privacy/">Privacy<span className="full"> Policy</span></Link>
          <Link to="/terms/">Terms<span className="full"> of Use</span></Link>
        </div>
        <div className="links gh-links">
          <a href="https://github.com/goodwright/imaps-api"><img src={githubIcon} alt="github" /> Backend code</a>
          <a href="https://github.com/goodwright/imaps"><img src={githubIcon} alt="github" /> Frontend code</a>
        </div>
      </div> */}
    </div>
  );
};

Sidebar.propTypes = {
  
};

export default Sidebar;