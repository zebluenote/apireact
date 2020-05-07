<?php

namespace App\Doctrine;

use App\Entity\User;
use RuntimeException;
use App\Entity\Invoice;
use App\Entity\Customer;
use InvalidArgumentException;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Security;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;

class CurrentUserExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{

    /**
     * 
     * @var Security
     */
    private $security;

    private $auth;

    /**
     * 
     * @param Security $security 
     * @return void 
     */
    public function __construct(Security $security, AuthorizationCheckerInterface $checker)
    {
        $this->security = $security;
        $this->auth = $checker;
    }

    /**
     * Permet de mutualiser le code utilisé pour intervenir sur les requêtes
     * aussi bien dans le cas d'une collection que d'un simple item
     * 
     * @param QueryBuilder $queryBuilder 
     * @param string $resourceClass 
     * @return void 
     * @throws InvalidArgumentException 
     * @throws RuntimeException 
     */
    private function addWhere(QueryBuilder $queryBuilder, string $resourceClass)
    {
        // Récupération de l'utilisateur courant (actuellement identifié)
        $user = $this->security->getUser();

        // dd($this->auth);

        // Si lon demande des invoices ou des customers (resourceClass), 
        // alors intervenir sur la requête pour qu'elle ne retourne que des éléments concernant cet utilisateur
        // Cas particulier : on peut souhaiter qu'un admin puisse lister toutes les factures ou tous les clients
        // Dans tous les cas on ne doit pas passer par ici si l'utilisateur courant n'est pas identifié
        if (
            $user instanceof User
            &&
            !$this->auth->isGranted('ROLE_ADMIN')
            &&
            ($resourceClass === Customer::class || $resourceClass === Invoice::class)
        ) {
            // Récupération de l'alias défini dans le querybuilder
            // dd($queryBuilder);
            $rootAlias = $queryBuilder->getRootAliases()[0];
            // dd($rootAlias);
            if ($resourceClass === Customer::class) {
                // le Customer est directement lié au User
                $queryBuilder->andWhere("$rootAlias.user = :user");
            } else if ($resourceClass === Invoice::class) {
                // l'Invoice est liée au User par l'intermédiaire du Customer, alors il est nécessaire d'ajouter une jointure
                $queryBuilder->join("$rootAlias.customer", "c")->andWhere("c.user = :user");
            }
            $queryBuilder->setParameter("user", $user);
            // dd($queryBuilder);
        }
    }

    /**
     * Intervention sur la requête dans le cas d'une collection
     * 
     * @param QueryBuilder $queryBuilder 
     * @param QueryNameGeneratorInterface $queryNameGenerator 
     * @param string $resourceClass 
     * @param null|string $operationName 
     * @return void 
     * @throws InvalidArgumentException 
     * @throws RuntimeException 
     */
    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?string $operationName = null)
    {
        $this->addWhere($queryBuilder, $resourceClass);
    }

    /**
     * Intervention sur la requête dans le cas d'un item simple
     * 
     * @param QueryBuilder $queryBuilder 
     * @param QueryNameGeneratorInterface $queryNameGenerator 
     * @param string $resourceClass 
     * @param array $identifiers 
     * @param null|string $operationName 
     * @param array $context 
     * @return void 
     * @throws InvalidArgumentException 
     * @throws RuntimeException 
     */
    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, ?string $operationName = null, array $context = [])
    {
        $this->addWhere($queryBuilder, $resourceClass);
    }
}
